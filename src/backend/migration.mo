import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  public type UserProfile = {
    name : Text;
  };

  public type Candidate = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    resumeBlobId : Text;
    status : Text;
  };

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

  public type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    candidates : Map.Map<Nat, Candidate>;
    nextCandidateId : Nat;
  };

  public type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    candidates : Map.Map<Nat, Candidate>;
    nextCandidateId : Nat;
    jobCategories : Map.Map<Text, JobCategory>;
  };

  public func run(old : OldActor) : NewActor {
    let jobCategories = Map.empty<Text, JobCategory>();
    { old with jobCategories };
  };
};
