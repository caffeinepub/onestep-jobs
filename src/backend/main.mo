import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Nat "mo:core/Nat";

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
    // Public function - no authorization check needed
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

  public query ({ caller }) func getCandidates() : async [Candidate] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access candidate list");
    };
    candidates.values().toArray();
  };
};
