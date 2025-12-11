import { GenericTable } from "@canonical/maas-react-components";
import { Button, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import useTestHistoryColumns from "../useTestHistoryColumns/useTestHistoryColumns";

import type { RootState } from "@/app/store/root/types";
import scriptResultSelectors from "@/app/store/scriptresult/selectors";
import type { ScriptResult } from "@/app/store/scriptresult/types";

type Props = {
  close: () => void;
  scriptResult: ScriptResult;
};
const TestHistory = ({ close, scriptResult }: Props) => {
  const columns = useTestHistoryColumns({ scriptResult });
  const history = useSelector((state: RootState) =>
    scriptResultSelectors.getHistoryById(state, scriptResult.id)
  );
  return (
    <>
      ...(({!history || history?.length <= 1})?
      <p className="u-align--center u-no-max-width" data-testid="no-history">
        {history?.length === 1 ? (
          "This test has only been run once."
        ) : (
          <Spinner text="Loading..." />
        )}
      </p>
      :
      <GenericTable
        aria-label="history table"
        className="history-table"
        columns={columns}
        data={history!}
        isLoading={false}
        noData="No history available."
        variant="regular"
      />
      )
      <div className="u-align--right u-nudge-left--small">
        <Button
          className="u-no-margin--bottom"
          onClick={() => {
            close();
          }}
        >
          Close
        </Button>
      </div>
    </>
  );
};

export default TestHistory;
