import { SignIn } from "@clerk/nextjs";
import { authAppearance } from "../../appearance";

export default function SignInPage() {
  return <SignIn appearance={authAppearance} />;
}
