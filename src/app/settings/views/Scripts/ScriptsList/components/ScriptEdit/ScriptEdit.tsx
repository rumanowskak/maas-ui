import { useCallback, useEffect, useState } from "react";

import {
  Notification,
  NotificationSeverity,
  Row,
} from "@canonical/react-components";
import classNames from "classnames";
import type { FileRejection, FileWithPath } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";

import type { ReadScriptResponse } from "../../../ScriptsUpload/readScript";
import readScript from "../../../ScriptsUpload/readScript";

import FormikField from "@/app/base/components/FormikField";
import FormikForm from "@/app/base/components/FormikForm";
import { useSidePanel } from "@/app/base/side-panel-context";
import { messageActions } from "@/app/store/message";
import type { RootState } from "@/app/store/root/types";
import { scriptActions } from "@/app/store/script";
import scriptSelectors from "@/app/store/script/selectors";
import type { Script } from "@/app/store/script/types";
import { ScriptType } from "@/app/store/script/types";

type Props = {
  id: Script["id"];
};

export enum Labels {
  FileUploadArea = "File upload area",
  DescriptionField = "Description",
  SubmitButton = "Edit script",
}

const ScriptEdit = ({ id }: Props): React.ReactElement | null => {
  const MAX_SIZE_BYTES = 2000000; // 2MB
  const dispatch = useDispatch();
  const { closeSidePanel } = useSidePanel();
  const errors = useSelector(scriptSelectors.errors);
  const saved = useSelector(scriptSelectors.saved);
  const saving = useSelector(scriptSelectors.saving);
  const hasErrors = useSelector(scriptSelectors.hasErrors);
  const script = useSelector((state: RootState) =>
    scriptSelectors.getById(state, id)
  );
  const [newScript, setNewScript] = useState<ReadScriptResponse | null>(null);
  const [savedName, setSavedName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
      let tooManyFiles = false;
      fileRejections.forEach((rejection) => {
        rejection.errors.forEach((error) => {
          if (error.code === "too-many-files") {
            if (!tooManyFiles) {
              dispatch(
                messageActions.add(
                  "Only a single file may be uploaded.",
                  NotificationSeverity.NEGATIVE
                )
              );
            }
            tooManyFiles = true;
            return;
          }
          dispatch(
            messageActions.add(
              `${rejection.file.name}: ${error.message}`,
              NotificationSeverity.NEGATIVE
            )
          );
        });
      });

      if (!fileRejections.length && acceptedFiles.length) {
        readScript(acceptedFiles[0], dispatch, setNewScript);
      }
    },
    [dispatch]
  );

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    maxSize: MAX_SIZE_BYTES,
    multiple: false,
  });

  useEffect(() => {
    if (hasErrors && errors && typeof errors === "object") {
      Object.values(errors).forEach((error) => {
        dispatch(
          messageActions.add(
            `Error saving ${savedName}: ${error}`,
            NotificationSeverity.NEGATIVE
          )
        );
      });
      dispatch(scriptActions.cleanup());
    }
  }, [savedName, hasErrors, errors, dispatch]);

  useEffect(() => {
    if (saved) {
      dispatch(scriptActions.cleanup());
      dispatch(
        messageActions.add(
          `${savedName} saved successfully.`,
          NotificationSeverity.INFORMATION
        )
      );
      setSavedName(null);
    }
  }, [dispatch, saved, savedName]);

  if (!script) {
    return null;
  }

  const hasFile = acceptedFiles.length > 0;
  const uploadedFile: FileWithPath = acceptedFiles[0];

  return (
    <div className="u-nudge-down">
      <Row>
        <p className="u-no-margin--bottom">ZTP script</p>
        <div
          {...getRootProps()}
          className={classNames("scripts-upload", {
            "scripts-upload--active": isDragActive,
            "scripts-upload--accept": isDragAccept,
            "scripts-upload--reject": isDragReject,
          })}
        >
          <input aria-label={Labels.FileUploadArea} {...getInputProps()} />
          {isDragActive ? (
            <p className="u-no-margin--bottom">Drop the file here ...</p>
          ) : (
            <p className="u-no-margin--bottom">
              Drag 'n' drop a script here ('.sh' file ext required), or click to
              select a file
            </p>
          )}
        </div>
        {uploadedFile ? (
          <p className="u-no-margin--top">
            {`${uploadedFile.path} (${uploadedFile.size} bytes) ready for upload.`}
          </p>
        ) : null}
        {hasFile ? (
          <p className="u-text--muted">
            Uploading a new script will update the edited script to the new one.
            Doing so will disable changing description of original script as it
            will no longer exist.
          </p>
        ) : null}
      </Row>
      <Row>
        <FormikForm
          initialValues={{ description: script.description }}
          onCancel={closeSidePanel}
          onSubmit={({ description }) => {
            dispatch(scriptActions.cleanup());
            if (hasFile && newScript?.script) {
              dispatch(
                scriptActions.upload(
                  ScriptType.SWITCH,
                  newScript.script,
                  newScript.name
                )
              );
              setSavedName(newScript.name ?? script.name);
            } else {
              dispatch(scriptActions.update({ id, description }));
              setSavedName(script.name);
            }
          }}
          onSuccess={closeSidePanel}
          saved={saved}
          saving={saving}
          submitLabel={Labels.SubmitButton}
        >
          <FormikField
            disabled={hasFile}
            label={Labels.DescriptionField}
            name="description"
            type="text"
          />
          <Notification severity="caution" title="">
            Changing this script will not affect switches that have already been
            deployed with it.
          </Notification>
        </FormikForm>
      </Row>
    </div>
  );
};

export default ScriptEdit;
