import {
  TemporalTransaction,
  TemporalTransactionType,
} from "@shared/transactions";
import { RiDesignEditLine, RiSystemDeleteBin2Line } from "solid-icons/ri";
import { createSignal, onCleanup, onMount } from "solid-js";
import { styled } from "solid-styled-components";

export const TableRow = styled("tr")`
  position: relative;
`;

export const TransactionBadge = styled("div")`
  border: none;
  color: #fff;
`;

export const TransactionRowActions = styled("div")`
  position: absolute;
  right: 12px;
  top: 14px;
  bottom: 0;
  display: flex;
`;

export const EditButton = styled("button")`
  border-radius: 0;
  padding-left: 2px;
  padding-right: 2px;

  &:hover {
    background: initial !important;
    color: hsl(var(--s)) !important;
  }
`;

export const DeleteButton = styled("button")`
  border-radius: 0;
  padding-left: 2px;
  padding-right: 2px;

  &:hover {
    background: initial !important;
    color: hsl(var(--er)) !important;
  }
`;

// Should be top = -(height of this tooltip + 32px)
// ::after is the arrow
export const EditTooltip = styled("div")`
  display: ${(props: { show: boolean }) => (props.show ? "block" : "none")};
  position: fixed;
  width: 180px;
  overflow-x: auto;
  height: fit-content;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  text-align: center;
  padding-right: 9px;
  margin-left: -178px;
  margin-top: -28px;
  z-index: 9999;
`;

export const DeleteTooltip = styled("div")`
  display: ${(props: { show: boolean }) => (props.show ? "block" : "none")};
  position: fixed;
  width: 200px;
  overflow-x: auto;
  height: fit-content;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  text-align: center;
  padding-right: 9px;
  margin-left: -168px;
  margin-top: -28px;
  z-index: 9999;
`;

export const TooltipBody = styled("div")`
  height: fit-content;
  border-radius: 4px;
  background: hsl(var(--b3));
  padding: 8px 12px;
`;

export const TooltipTitle = styled("span")`
  display: block;
  margin-bottom: -16px;
`;

export const BottomArrow = styled("div")`
  position: absolute;
  bottom: 30px;
  background: hsl(var(--b3));
  width: 12px;
  height: 12px;
  transform: rotate(45deg);
  right: 5px;
`;

export interface TransactionsTableRowProps {
  transaction: TemporalTransaction;
}

export default function TransactionsTableRow(props: TransactionsTableRowProps) {
  let ref: HTMLTableRowElement;
  const [showActions, setShowActions] = createSignal(false);
  const [showEditTooltip, setShowEditTooltip] = createSignal(false);
  const [showDeleteTooltip, setShowDeleteTooltip] = createSignal(false);

  const onMouseEnter = () => {
    if (!showEditTooltip()) setShowActions(true);
    if (!showDeleteTooltip()) setShowActions(true);
  };

  const onMouseLeave = () => {
    if (!showEditTooltip() && !showDeleteTooltip()) setShowActions(false);
  };

  const onClickEdit = () => {
    if (showDeleteTooltip()) setShowDeleteTooltip(false);
    setShowEditTooltip(!showEditTooltip());
  };

  const onClickDelete = () => {
    if (showEditTooltip()) setShowEditTooltip(false);
    setShowDeleteTooltip(!showDeleteTooltip());
  };

  const handleClick = (event: MouseEvent) => {
    if (showActions() && !ref.contains(event.target as Node)) {
      setShowActions(false);
      setShowEditTooltip(false);
      setShowDeleteTooltip(false);
    }
  };

  onMount(() => {
    document.addEventListener("click", handleClick);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleClick);
  });

  return (
    <TableRow
      // rome-ignore lint/style/noNonNullAssertion: <explanation>
      ref={ref!}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <td class="font-bold">
        {props.transaction.date?.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </td>
      <td>{props.transaction.description}</td>
      <td
        class={
          props.transaction.type === TemporalTransactionType.CREDIT
            ? "text-success"
            : "text-error"
        }
      >
        {`${
          props.transaction.type === TemporalTransactionType.CREDIT ? "$" : "-$"
        }${props.transaction.amount.toFixed(2)}`}
      </td>
      <td>
        {props.transaction.tags.map((tag) => (
          <TransactionBadge class="badge bg-primary">{tag}</TransactionBadge>
        ))}
        {showActions() && (
          <TransactionRowActions class="btn-group">
            <EditButton
              class="btn btn-sm btn-ghost"
              type="button"
              aria-label="Row Edit Button"
              onClick={onClickEdit}
            >
              <RiDesignEditLine size={24} />
            </EditButton>
            <EditTooltip show={showEditTooltip()}>
              <TooltipBody>
                <TooltipTitle>Edit all instances?</TooltipTitle>
                <br />
                <div class="btn-group">
                  <button class="btn btn-sm btn-error" type="button">
                    All
                  </button>
                  <button class="btn btn-sm btn-neutral" type="button">
                    This
                  </button>
                </div>
              </TooltipBody>
              <BottomArrow />
            </EditTooltip>
            <DeleteButton
              class="btn btn-sm btn-ghost"
              type="button"
              aria-label="Row Delete Button"
              onClick={onClickDelete}
            >
              <RiSystemDeleteBin2Line size={24} />
            </DeleteButton>
            <DeleteTooltip show={showDeleteTooltip()}>
              <TooltipBody>
                <TooltipTitle>Delete all instances?</TooltipTitle>
                <br />
                <div class="btn-group">
                  <button class="btn btn-sm btn-error" type="button">
                    All
                  </button>
                  <button class="btn btn-sm btn-neutral" type="button">
                    This
                  </button>
                </div>
              </TooltipBody>
              <BottomArrow />
            </DeleteTooltip>
          </TransactionRowActions>
        )}
      </td>
    </TableRow>
  );
}
