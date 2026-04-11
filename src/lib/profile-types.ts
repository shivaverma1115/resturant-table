export type ProfileResponse = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  displayName: string | null;
  photoURL: string | null;
  profile: {
    age: number | null;
  };
};
