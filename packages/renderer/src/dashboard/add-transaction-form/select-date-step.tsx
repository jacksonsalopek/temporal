import { DashboardSlice } from "@/store/dashboard";
import { useSSD } from "@shared/ssd";
import { SimpleDatepicker } from "solid-simple-datepicker";

// Styles for the datepicker
import "solid-simple-datepicker/styles.css";

export default function SelectDateStep() {
  const store = useSSD();
  const dashboardSlice = store?.refs.dashboard as DashboardSlice;
  const date = () => dashboardSlice.getAddTransactionFormDate()
  const setDate = (date: Date) => dashboardSlice.setAddTransactionFormDate(date);
  
  return (
    <>
      <p class="text-center"><b>Step 1:</b> When is/was the transaction?</p>
      <br />
      <SimpleDatepicker date={date()} onChange={setDate} footer={false} startYear={2000}/>
      <style jsx>
        {`
          .SimpleDatepicker {
            --sd-background-color: hsl(var(--b3)) !important;
            --sd-text-color: hsl(var(--nc)) !important;
            --sd-primary-color: hsl(var(--p)) !important;
            --sd-primary-focus-color: hsl(var(--pf)) !important;
            --sd-primary-hover-color: hsl(var(--pf)) !important;
            width: 100%;
          }
        `}
      </style>
    </>
  )
}
