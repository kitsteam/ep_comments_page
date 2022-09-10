'use strict';

const commentL10n = require('ep_comments_page/static/js/commentL10n');

let $newComment = $();

// Create a comment object with data filled on the given form
const buildCommentFrom = (form) => {
  const text = form.find('.comment-content').val();
  const changeFrom = form.find('.from-value').text();
  const changeTo = form.find('.to-value').val() || null;
  const comment = {};

  comment.text = text;
  if (changeTo) {
    comment.changeFrom = changeFrom;
    comment.changeTo = changeTo;
  }

  return comment;
};

// Callback for new comment Cancel
const cancelNewComment = () => {
  hideNewCommentPopup();
};

// Callback for new comment Submit
const submitNewComment = (callback) => {
  const index = 0;
  const comment = buildCommentFrom($newComment);
  if (comment.text.length > 0 || comment.changeTo && comment.changeTo.length > 0) {
    $newComment.find('.comment-content, .to-value').removeClass('error');
    hideNewCommentPopup();
    callback(comment, index);
  } else {
    if (comment.text.length === 0) $newComment.find('.comment-content').addClass('error');
    if (comment.changeTo && comment.changeTo.length === 0) {
      $newComment.find('.to-value').addClass('error');
    }
  }
  return false;
};

/* ***** Public methods: ***** */

const localizenewCommentPopup = () => {
  if ($newComment.length !== 0) commentL10n.localize($newComment);
};

// Insert new Comment Form
const insertNewCommentPopupIfDontExist = (comment, callback) => {
  $newComment.remove();

  comment.commentId = '';
  $newComment = $('#newCommentTemplate').tmpl(comment);
  $newComment.appendTo($('#editorcontainerbox'));

  localizenewCommentPopup();

  // Listen for include suggested change toggle
  $newComment.find('.suggestion-checkbox').change(function () {
    $newComment.find('.suggestion').toggle($(this).is(':checked'));
  });

  // Cancel btn
  $newComment.find('#comment-reset').on('click', () => {
    cancelNewComment();
  });
  // Create btn
  $newComment.on('submit', (e) => {
    e.preventDefault();
    return submitNewComment(callback);
  });

  return $newComment;
};

// The variable position is an array consisting of x and y coordinates
const showNewCommentPopup = (position) => {
  // position below comment icon
  position = position || [];

  const xPosition = position[0] || 0;
  const yPosition = position[1] || 0;
  
  // This code snippet prioritizes the position passed to the method.
  // It ensures that it cannot go out of the right border of the padInnerElement.
  const padInnerElement = $('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]');
  const popupLeftPositionFromRightBorderOfPadInnerElement =  padInnerElement.width() - $('#newComment').width();
  const left = Math.max(
    Math.min(
        xPosition,
        popupLeftPositionFromRightBorderOfPadInnerElement,
      ),
      xPosition
    );
  $newComment.css('left', left);

  const top = yPosition;
  if (left === position[0]) {
    $newComment.css('top', top);
  }

  // Reset form to make sure it is all clear
  $newComment.find('.suggestion-checkbox').prop('checked', false).trigger('change');
  $newComment.find('textarea').val('');
  $newComment.find('.comment-content, .to-value').removeClass('error');

  // Show popup
  $newComment.addClass('popup-show');
  $newComment.find('.comment-content').focus();

  // mark selected text, so it is clear to user which text range the comment is being applied to
  pad.plugins.ep_comments_page.preCommentMarker.markSelectedText();
};

const hideNewCommentPopup = () => {
  $newComment.removeClass('popup-show');

  // force focus to be lost, so virtual keyboard is hidden on mobile devices
  $newComment.find(':focus').blur();

  // unmark selected text, as now there is no text being commented
  pad.plugins.ep_comments_page.preCommentMarker.unmarkSelectedText();
};

exports.localizenewCommentPopup = localizenewCommentPopup;
exports.insertNewCommentPopupIfDontExist = insertNewCommentPopupIfDontExist;
exports.showNewCommentPopup = showNewCommentPopup;
exports.hideNewCommentPopup = hideNewCommentPopup;
