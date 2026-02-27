import { Suspense } from "react";

import { ProtectedPageContent } from "@/app/(protected)/_components/protected-page-content";
import { UserDetails } from "@/app/(protected)/_components/user-details";

export default function ProtectedPage() {
  return (
    <Suspense>
      <ProtectedPageContent
        userDetails={
          <Suspense>
            <UserDetails />
          </Suspense>
        }
      />
    </Suspense>
  );
}

