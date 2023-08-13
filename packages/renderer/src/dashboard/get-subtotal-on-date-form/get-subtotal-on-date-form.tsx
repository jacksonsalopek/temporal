import { DashboardSlice } from "@/store/dashboard";
import { useSSD } from "@shared/ssd";

// Form steps
import Result from "./result";
import SelectDateStep from "./select-date-step";

export default function GetSubtotalOnDateForm() {
  const store = useSSD();
  const dashboardSlice = store?.refs.dashboard as DashboardSlice;

  const currentStepComponent = () => {
    if (dashboardSlice.getGetSubtotalOnDateFormDate()) {
      return <Result />;
    } else {
      return <SelectDateStep />;
    }
  };

  return <div class="form-control w-full">{currentStepComponent()}</div>;
}
