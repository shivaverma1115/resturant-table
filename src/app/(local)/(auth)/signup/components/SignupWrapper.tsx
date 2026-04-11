import SignupView from "./SignupView";

export default function SignupWrapper({
  envStatus,
}: Readonly<{
  envStatus: {
    ready: boolean;
    hasWebApiKey: boolean;
    hasAdmin: boolean;
  };
}>) {
  return <SignupView envStatus={envStatus} />;
}
