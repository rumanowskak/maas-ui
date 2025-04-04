import type { ValueOf } from "@canonical/react-components";

import type { SidePanelContent } from "@/app/base/types";

export const ZoneActionSidePanelViews = {
  CREATE_ZONE: ["zoneForm", "createZone"],
  EDIT_ZONE: ["zoneForm", "editZone"],
  DELETE_ZONE: ["zoneForm", "deleteZone"],
} as const;

export type ZoneSidePanelContent = SidePanelContent<
  ValueOf<typeof ZoneActionSidePanelViews>,
  { zoneId: number }
>;
