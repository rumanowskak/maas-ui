import { Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { useFetchActions, useWindowTitle } from "@/app/base/hooks";
import KVMConfigurationCard from "@/app/kvm/components/KVMConfigurationCard";
import podSelectors from "@/app/store/pod/selectors";
import type { Pod } from "@/app/store/pod/types";
import { isPodDetails } from "@/app/store/pod/utils";
import { resourcePoolActions } from "@/app/store/resourcepool";
import resourcePoolSelectors from "@/app/store/resourcepool/selectors";
import type { RootState } from "@/app/store/root/types";
import { tagActions } from "@/app/store/tag";
import tagSelectors from "@/app/store/tag/selectors";
import { zoneActions } from "@/app/store/zone";
import zoneSelectors from "@/app/store/zone/selectors";

type Props = {
  id: Pod["id"];
};

export enum Label {
  Title = "Virsh settings",
}

const VirshSettings = ({ id }: Props): JSX.Element | null => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, id)
  );
  const resourcePoolsLoaded = useSelector(resourcePoolSelectors.loaded);
  const tagsLoaded = useSelector(tagSelectors.loaded);
  const zonesLoaded = useSelector(zoneSelectors.loaded);
  const loaded = resourcePoolsLoaded && tagsLoaded && zonesLoaded;
  useWindowTitle(`Virsh ${`${pod?.name} ` || ""} settings`);

  useFetchActions([
    resourcePoolActions.fetch,
    tagActions.fetch,
    zoneActions.fetch,
  ]);

  if (!isPodDetails(pod) || !loaded) {
    return <Spinner text="Loading..." />;
  }
  return (
    <>
      <KVMConfigurationCard aria-label={Label.Title} pod={pod} />
    </>
  );
};

export default VirshSettings;
