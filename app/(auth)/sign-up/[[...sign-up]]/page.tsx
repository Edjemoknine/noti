import { SignUp } from "@clerk/nextjs";
import { authAppearance } from "../../appearance";

export default function SignUpPage() {
  return <SignUp appearance={authAppearance} />;
}
