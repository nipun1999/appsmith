import React from "react";
import { Popover, Position } from "@blueprintjs/core";
import AddCommentInput from "./AddCommentInput";
import { ThreadContainer } from "./StyledComponents";
import { useDispatch } from "react-redux";
import styled, { withTheme } from "styled-components";
import { get } from "lodash";
import {
  createCommentThreadRequest as createCommentThreadAction,
  removeUnpublishedCommentThreads,
} from "actions/commentActions";
import Icon, { IconSize } from "components/ads/Icon";
import { Theme } from "constants/DefaultTheme";
import { RawDraftContentState } from "draft-js";
import { CommentThread } from "entities/Comments/CommentsInterfaces";

const CommentTriggerContainer = styled.div<{ top: number; left: number }>`
  position: absolute;
  top: ${(props) => props.top}%;
  left: ${(props) => props.left}%;
`;

// TODO look into drying this up using comment thread component
const UnpublishedCommentThread = withTheme(
  ({
    theme,
    commentThread,
  }: {
    commentThread: CommentThread;
    theme: Theme;
  }) => {
    const { top, left } = get(commentThread, "position", {
      top: 0,
      left: 0,
    });
    const dispatch = useDispatch();
    const onClosing = () => {
      dispatch(removeUnpublishedCommentThreads());
    };

    const createCommentThread = (text: RawDraftContentState) => {
      dispatch(createCommentThreadAction({ commentBody: text, commentThread }));
    };

    return (
      <div
        key={`${top}-${left}`}
        onClick={(e: any) => {
          // capture clicks so that create new thread is not triggered
          e.preventDefault();
          e.stopPropagation();
        }}
        data-cy="unpublished-comment-thread"
      >
        <CommentTriggerContainer top={top} left={left}>
          <Popover
            hasBackdrop
            autoFocus
            canEscapeKeyClose
            minimal
            isOpen={true}
            position={Position.BOTTOM_RIGHT}
            popoverClassName="comment-thread"
            onInteraction={(nextOpenState) => {
              if (!nextOpenState) {
                onClosing();
              }
            }}
          >
            <Icon
              name="unread-pin"
              fillColor={theme.colors.comments.pin}
              size={IconSize.XXL}
            />
            <ThreadContainer tabIndex={0}>
              <AddCommentInput onSave={createCommentThread} />
            </ThreadContainer>
          </Popover>
        </CommentTriggerContainer>
      </div>
    );
  },
);

export default UnpublishedCommentThread;
