import serverSideFetch from "@/app/service";
import { OnboardingQuestionsForm } from "@/components/event-creation/onboarding-questions-form"

// Example initial data
const initialData = {
  default_questions: ["Name", "Email", "Gender", "Phone", "Github URL", "LinkedIn URL"],
  custom_questions: [
  ],
}

export default async function DataCollect({params}) {
  const id = (await params).id;
  const data = await serverSideFetch(`/event-registration/host/onboarding-question/${id}/`);
  console.log("Data", data)
  return (
    <div className="container mx-auto py-10">
      <OnboardingQuestionsForm eventId={id} initialData={data || initialData} />
    </div>
  )
}
