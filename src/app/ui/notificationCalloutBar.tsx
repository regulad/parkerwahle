import {FiX} from "react-icons/fi";
import {clsx} from "clsx";
import {cookies} from "next/headers";

const thisCalloutId = "tutoringCallout2024" + "Dismissed"; // update this when I update the callout
const thisCallout = (
  <p className="text-center">
    Visit my new tutoring site: <a href="https://tutoring.regulad.xyz"
                                   className="classic-link">https://tutoring.regulad.xyz</a>
  </p>
);

async function dismissCallout(formData: FormData) {
  "use server";

  const cookieStore = cookies();
  cookieStore.set({
    name: thisCalloutId,
    value: "true",
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 1000, // 1 year
    expires: new Date(Date.now() + 60 * 60 * 24 * 365 * 1000),  // 1 year
  });
}

export default function NotificationCalloutBar() {
  const cookieStore = cookies();
  const shouldShow = cookieStore.get(thisCalloutId)?.value !== "true";

  return (
    <div className={clsx("bg-yellow-300 text-black p-4", shouldShow ? "block" : "hidden")}>
      <div className="flex justify-between items-center container">
        {thisCallout}
        <form action={dismissCallout}>
          <button
            type="submit"
            className="text-black"
          >
            <FiX className="h-6 w-6"/>
          </button>
        </form>
      </div>
    </div>
  );
}
