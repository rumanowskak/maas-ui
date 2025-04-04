import configureStore from "redux-mock-store";

import ImageList, { Labels as ImageListLabels } from "./ImageList";

import { ConfigNames } from "@/app/store/config/types";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { screen, renderWithBrowserRouter } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("ImageList", () => {
  it("stops polling when unmounted", () => {
    const state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
            name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
            value: false,
          }),
        ],
        loaded: true,
      }),
    });
    const store = mockStore(state);
    const { unmount } = renderWithBrowserRouter(<ImageList />, {
      route: "/images",
      store,
    });
    unmount();
    expect(
      store
        .getActions()
        .some((action) => action.type === "bootresource/pollStop")
    ).toBe(true);
  });

  it("shows a warning if automatic image sync is disabled", () => {
    const state = factory.rootState({
      config: factory.configState({
        items: [
          factory.config({
            name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT,
            value: false,
          }),
        ],
        loaded: true,
      }),
    });
    renderWithBrowserRouter(<ImageList />, {
      route: "/images",
      state,
    });

    expect(screen.getByText(ImageListLabels.SyncDisabled)).toBeInTheDocument();
  });
});
