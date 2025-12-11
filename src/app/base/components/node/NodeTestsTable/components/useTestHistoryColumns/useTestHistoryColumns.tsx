import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";

import ScriptStatus from "@/app/base/components/ScriptStatus";
import type {
  PartialScriptResult,
  ScriptResult,
} from "@/app/store/scriptresult/types";
import { ScriptResultType } from "@/app/store/scriptresult/types";

type Props = {
  scriptResult: ScriptResult;
};

type TestHistoryColumnDef = ColumnDef<
  PartialScriptResult,
  Partial<PartialScriptResult>
>;

const useTestHistoryColumns = ({
  scriptResult,
}: Props): TestHistoryColumnDef[] => {
  const isTesting = scriptResult.result_type === ScriptResultType.TESTING;

  return useMemo(
    () => [
      ...(isTesting
        ? [
            {
              id: "suppress-col",
              header: "",
              accessorKey: "suppress-col",
              enableSorting: false,
              cell: () => {},
            },
          ]
        : []),
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        enableSorting: false,
        cell: () => {},
      },
      {
        id: "tags",
        header: "Tags",
        accessorKey: "tags",
        enableSorting: false,
        cell: () => {},
      },
      {
        id: "result",
        header: "Result",
        accessorKey: "result",
        enableSorting: false,
        cell: ({ row }) => (
          <ScriptStatus status={row.original.status}>
            {row.original.status_name}{" "}
            <Link
              data-testid="details-link"
              to={`${location.pathname}/${row.original.id}/details`}
            >
              View log
            </Link>
          </ScriptStatus>
        ),
      },
      {
        id: "date",
        header: "Date",
        accessorKey: "date",
        enableSorting: false,
        cell: ({ row }) => <>{row.original.updated || "—"}</>,
      },
      {
        id: "runtime",
        header: "Runtime",
        accessorKey: "runtime",
        enableSorting: false,
        cell: ({ row }) => <>{row.original.runtime || "—"}</>,
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "actions",
        enableSorting: false,
        cell: () => {},
      },
    ],
    [isTesting]
  );
};

export default useTestHistoryColumns;
