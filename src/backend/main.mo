import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile Type and Storage
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Candidate Management
  public type Candidate = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    resumeBlobId : Text;
    status : Text; // "pending", "approved", "rejected"
  };

  let candidates = Map.empty<Nat, Candidate>();
  var nextCandidateId = 1;

  public shared ({ caller }) func registerCandidate(name : Text, phone : Text, email : Text, resumeBlobId : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register as candidates");
    };

    let candidateId = nextCandidateId;
    let newCandidate : Candidate = {
      id = candidateId;
      name;
      phone;
      email;
      resumeBlobId;
      status = "pending";
    };
    candidates.add(candidateId, newCandidate);
    nextCandidateId += 1;
    candidateId;
  };

  public query ({ caller }) func getCandidates() : async [Candidate] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access candidate list");
    };
    let candidatesList = List.empty<Candidate>();
    candidates.entries().forEach(
      func((_, candidate)) {
        candidatesList.add(candidate);
      }
    );
    candidatesList.toArray();
  };

  public shared ({ caller }) func approveCandidate(candidateId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve candidates");
    };

    switch (candidates.get(candidateId)) {
      case (null) { Runtime.trap("Candidate not found") };
      case (?candidate) {
        let updatedCandidate = {
          candidate with status = "approved";
        };
        candidates.add(candidateId, updatedCandidate);
      };
    };
  };

  public shared ({ caller }) func rejectCandidate(candidateId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject candidates");
    };

    switch (candidates.get(candidateId)) {
      case (null) { Runtime.trap("Candidate not found") };
      case (?candidate) {
        let updatedCandidate = {
          candidate with status = "rejected";
        };
        candidates.add(candidateId, updatedCandidate);
      };
    };
  };

  public shared ({ caller }) func setPendingCandidate(candidateId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set candidate status to pending");
    };

    switch (candidates.get(candidateId)) {
      case (null) { Runtime.trap("Candidate not found") };
      case (?candidate) {
        let updatedCandidate = {
          candidate with status = "pending";
        };
        candidates.add(candidateId, updatedCandidate);
      };
    };
  };

  // Job Category and Listing Management
  public type JobCategory = {
    name : Text;
    icon : Text;
    jobs : [Job];
  };

  public type Job = {
    title : Text;
    category : Text;
    jobType : Text;
    location : Text;
    description : Text;
  };

  let jobCategories = Map.empty<Text, JobCategory>();

  // Function to get all job categories with their jobs - PUBLIC ACCESS
  public query func getJobCategories() : async [JobCategory] {
    let categoriesList = List.empty<JobCategory>();
    jobCategories.entries().forEach(
      func((_, category)) {
        categoriesList.add(category);
      }
    );
    categoriesList.toArray();
  };

  func getCategory(name : Text, icon : Text, jobs : [Job]) : JobCategory {
    { name; icon; jobs };
  };

  // Initialize job categories with sample data
  system func preupgrade() {
    let sampleData : [(Text, JobCategory)] = [
      (
        "IT",
        getCategory(
          "IT",
          "monitor",
          [
            {
              title = "Software Engineer";
              category = "IT";
              jobType = "Full-time";
              location = "Remote";
              description = "Develop and maintain software applications.";
            },
            {
              title = "Network Administrator";
              category = "IT";
              jobType = "Full-time";
              location = "Remote";
              description = "Manage and maintain network infrastructure.";
            },
          ],
        ),
      ),
      (
        "Finance",
        getCategory(
          "Finance",
          "chart",
          [
            {
              title = "Accountant";
              category = "Finance";
              jobType = "Full-time";
              location = "Remote";
              description = "Prepare and analyze financial records.";
            },
            {
              title = "Financial Analyst";
              category = "Finance";
              jobType = "Full-time";
              location = "Remote";
              description = "Analyze financial data and trends.";
            },
          ],
        ),
      ),
      (
        "Marketing",
        getCategory(
          "Marketing",
          "megaphone",
          [
            {
              title = "Marketing Manager";
              category = "Marketing";
              jobType = "Full-time";
              location = "Remote";
              description = "Develop marketing strategies and campaigns.";
            },
            {
              title = "Content Writer";
              category = "Marketing";
              jobType = "Full-time";
              location = "Remote";
              description = "Create content for marketing materials.";
            },
          ],
        ),
      ),
      (
        "Healthcare",
        getCategory(
          "Healthcare",
          "heartbeat",
          [
            {
              title = "Nurse";
              category = "Healthcare";
              jobType = "Full-time";
              location = "Remote";
              description = "Provide patient care and support.";
            },
            {
              title = "Medical Assistant";
              category = "Healthcare";
              jobType = "Full-time";
              location = "Remote";
              description = "Assist healthcare professionals in medical settings.";
            },
          ],
        ),
      ),
      (
        "Engineering",
        getCategory(
          "Engineering",
          "engineering",
          [
            {
              title = "Civil Engineer";
              category = "Engineering";
              jobType = "Full-time";
              location = "Remote";
              description = "Design and oversee construction projects.";
            },
            {
              title = "Mechanical Engineer";
              category = "Engineering";
              jobType = "Full-time";
              location = "Remote";
              description = "Design and develop mechanical systems.";
            },
          ],
        ),
      ),
      (
        "Sales",
        getCategory(
          "Sales",
          "handshake",
          [
            {
              title = "Sales Representative";
              category = "Sales";
              jobType = "Full-time";
              location = "Remote";
              description = "Promote and sell products or services.";
            },
            {
              title = "Account Manager";
              category = "Sales";
              jobType = "Full-time";
              location = "Remote";
              description = "Manage client accounts and relationships.";
            },
          ],
        ),
      ),
    ];

    for ((cat, entry) in sampleData.values()) {
      jobCategories.add(cat, entry);
    };
  };

  // Job Management Functions
  public type FetchJobsByCategoryParams = {
    category : ?Text;
    jobType : ?Text;
    location : ?Text;
  };

  public query func fetchJobsByCategory(params : FetchJobsByCategoryParams) : async [Job] {
    let jobsList = List.empty<Job>();

    let categoriesIter = jobCategories.entries();
    categoriesIter.forEach(
      func((categoryName, category)) {
        // Handle jobType and location filtering
        let jobsIter = category.jobs.values();
        jobsIter.forEach(
          func(job) {
            let jobMatchesType = switch (params.jobType) {
              case (?jobType) { Text.equal(job.jobType, jobType) };
              case (null) { true };
            };

            let jobMatchesLocation = switch (params.location) {
              case (?location) { Text.equal(job.location, location) };
              case (null) { true };
            };

            if (jobMatchesType and jobMatchesLocation) {
              jobsList.add(job);
            };
          }
        );
      }
    );
    jobsList.toArray();
  };
};

