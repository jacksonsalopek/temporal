import { DashboardSlice } from "@/store/dashboard";
import { useSSD } from "@shared/ssd";

// Form steps
import AddTagsStep from "./add-tags-step";
import AddTransactionDetailsStep from "./add-transaction-details-step";
import ReviewFormStep from "./review-form-step";
import SelectDateStep from "./select-date-step";

export default function AddTransactionForm() {
  const store = useSSD();
  const dashboardSlice = store?.refs.dashboard as DashboardSlice;

  const currentStep = () => dashboardSlice.getAddTransactionFormStep();

  const currentStepComponent = () => {
    switch (currentStep()) {
      case 1: return <AddTransactionDetailsStep />;
      case 2: return <AddTagsStep />;
      case 3: return <ReviewFormStep />;
      default: return <SelectDateStep />;
    }
  }

  return (
    <div class="form-control w-full">
      {currentStepComponent()}
    </div>
  )
}
