function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("OWNS_RELATION", "OWNS");
define("BORROWED_RELATION", "BORROWED");
define("CURRENTLY_READING_RELATION", "CURRENTLY_READING");
define("ADDRESSES_RELATION", "addresses");
define("GOODREADS_REC_RELATION", "GR_REC");
define("READ_RELATION", "READ");
define("REMINDER_RELATION", "REMINDER_ABOUT");
define("ACTIVITY_RELATION", "ACTIVITY");
define("USER_GROUP_RELATION", "USER_ACCESS");
define("NOTIFICATION_RELATION", "NOTIFICATION");
define("CONNECTED_RELATION", "CONNECTED");
define("WISHLIST_RELATION", "WISH");

define("FRIEND_REQ_SENT", "FRIEND_REQ_SENT");
define("FRIEND_REQ_APPROVAL_PENDING", "FRIEND_REQ_APPROVAL_PENDING");
define("ADDRESS_TYPE_HOME", "HOME");
define("ADDRESS_TYPE_WORK", "WORK");
define("ADDRESS_TYPE_OTHER", "OTHER");
define("FRIEND_REQUEST_SENT_NOTIFICATION", "FRIEND_REQUEST_SENT");
define("FRIEND_REQUEST_ACCEPTED_NOTIFICATION", "FRIEND_REQUEST_ACCEPTED");

define("AVAILABLE", "AVAILABLE");
define("PRIVATE", "PRIVATE");
define("OWNS", "OWN");
define("WISHLIST", "WISH");
define("READ", "READ");
define("CURRENTLY_READING", "CURRENTLY_READING");
define("LENT", "LENT");
define("BORROWED", "BORROWED");
define("BORROW_LOCK", "BORROW_LOCK");
define("BORROW_IN_PROGRESS", "BORROW_IN_PROGRESS");
define("ALL", "ALL");
define("ID", "id");

define("GR_ID", "grId");

define("SELF", "SELF");

define("BORROW_AGREED", "agreed");
define("BORROW_SUCCESS", "success");
define("BORROW_REJECT", "reject");

define("RETURN_INIT", "init");
define("RETURN_AGREED", "agreed");
define("RETURN_SUCCESS", "success");

define("ADDRESS_DELETED_EVENT", "ADDRESS_DELETED");

define("FRIEND_REQUEST_CANCEL_DELETE", "FRIEND_REQUEST_CANCEL_DELETE");
define("FRIEND_UNFRIEND_DELETE", "FRIEND_REQUEST_CANCEL_DELETE");

define("STATUS", "status");

define("ACCESS_TOKEN_QPARAM", "accessToken");
define("IN_PROGRESS_GREADS_STATUS", "inProgress");
define("FILTER_QPARAM", "filter");
define("STATUS_QPARAM", "status");

define("CREATED_BY_QPARAM", "createdBy");
define("REMINDER_ABOUT_QPARM", "reminderAbout");
define("FRESH_NOTIFICATION_TYPE", "fresh");
define("SEARCH_QPARAM", "q");
define("SIZE_QPARAM", "size");
define("INCLUDE_FRIENDS_QPARAM", "includeFriends");

define("LISTING_TYPE_QPARAM", "listingType");
define("ID_TYPE_QPARAM", "idType");
define("LOGGED_IN_USER_QPARAM", "loggedInUser");
define("SHARE_PH_QPARAM", "sharePh");
define("MESSAGE_QPARAM", "message");
define("OWNER_USER_ID_QPARAM", "ownerUserId");
define("BORROWER_ID_QPARAM", "borrowerId");