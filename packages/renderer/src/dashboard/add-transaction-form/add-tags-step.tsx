import { DashboardSlice } from "@/store/dashboard";
import { useSSD } from "@shared/ssd";
import { FaSolidX } from "solid-icons/fa";
import { createSignal } from "solid-js";
import { styled } from "solid-styled-components";

export const TagWrapper = styled("div")`
  &:hover {
    cursor: pointer;
  }
`;

export function Tag(props: { name: string; onClick?: () => void }) {
  return (
    <TagWrapper class="badge badge-primary gap-2" onClick={props.onClick}>
      <FaSolidX size={12} fill="currentcolor" />
      {props.name}
    </TagWrapper>
  );
}

export default function AddTagsStep() {
  const store = useSSD();
  const dashboardSlice = store?.refs.dashboard as DashboardSlice;
  const [currentTag, setCurrentTag] = createSignal("");

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && currentTag()) {
      dashboardSlice.pushAddTransactionFormTag(currentTag());
      setCurrentTag("");
    }
  };

  return (
    <>
      <p class="text-center">
        <b>Step 3:</b> Add tags to your transaction
      </p>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Tags</span>
        </label>
        <input
          type="text"
          class="input input-bordered"
          placeholder="e.g. bills"
          value={currentTag()}
          onInput={(e) => setCurrentTag(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
        <label class="label">
          <span class="label-text-alt" />
          <span class="label-text-alt">To add a tag, hit enter</span>
        </label>
      </div>
      <div class="w-full">
        <div class="flex flex-wrap gap-2">
          {dashboardSlice.getAddTransactionFormTags()?.map((tag) => (
            <Tag
              name={tag}
              onClick={() => dashboardSlice.removeAddTransactionFormTag(tag)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
