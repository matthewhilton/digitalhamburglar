"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffersOrderBy = exports.AccountsOrderBy = void 0;
/** Methods to use when ordering `Account`. */
var AccountsOrderBy;
(function (AccountsOrderBy) {
    AccountsOrderBy["Natural"] = "NATURAL";
    AccountsOrderBy["IdAsc"] = "ID_ASC";
    AccountsOrderBy["IdDesc"] = "ID_DESC";
    AccountsOrderBy["UsernameAsc"] = "USERNAME_ASC";
    AccountsOrderBy["UsernameDesc"] = "USERNAME_DESC";
    AccountsOrderBy["PasswordAsc"] = "PASSWORD_ASC";
    AccountsOrderBy["PasswordDesc"] = "PASSWORD_DESC";
    AccountsOrderBy["CreatedAsc"] = "CREATED_ASC";
    AccountsOrderBy["CreatedDesc"] = "CREATED_DESC";
    AccountsOrderBy["PrimaryKeyAsc"] = "PRIMARY_KEY_ASC";
    AccountsOrderBy["PrimaryKeyDesc"] = "PRIMARY_KEY_DESC";
})(AccountsOrderBy = exports.AccountsOrderBy || (exports.AccountsOrderBy = {}));
/** Methods to use when ordering `Offer`. */
var OffersOrderBy;
(function (OffersOrderBy) {
    OffersOrderBy["Natural"] = "NATURAL";
    OffersOrderBy["IdAsc"] = "ID_ASC";
    OffersOrderBy["IdDesc"] = "ID_DESC";
    OffersOrderBy["ExternalIdAsc"] = "EXTERNAL_ID_ASC";
    OffersOrderBy["ExternalIdDesc"] = "EXTERNAL_ID_DESC";
    OffersOrderBy["TitleAsc"] = "TITLE_ASC";
    OffersOrderBy["TitleDesc"] = "TITLE_DESC";
    OffersOrderBy["DescriptionAsc"] = "DESCRIPTION_ASC";
    OffersOrderBy["DescriptionDesc"] = "DESCRIPTION_DESC";
    OffersOrderBy["McdOfferidAsc"] = "MCD_OFFERID_ASC";
    OffersOrderBy["McdOfferidDesc"] = "MCD_OFFERID_DESC";
    OffersOrderBy["McdPropidAsc"] = "MCD_PROPID_ASC";
    OffersOrderBy["McdPropidDesc"] = "MCD_PROPID_DESC";
    OffersOrderBy["LastCheckedAsc"] = "LAST_CHECKED_ASC";
    OffersOrderBy["LastCheckedDesc"] = "LAST_CHECKED_DESC";
    OffersOrderBy["AccountIdAsc"] = "ACCOUNT_ID_ASC";
    OffersOrderBy["AccountIdDesc"] = "ACCOUNT_ID_DESC";
    OffersOrderBy["ExpiresAsc"] = "EXPIRES_ASC";
    OffersOrderBy["ExpiresDesc"] = "EXPIRES_DESC";
    OffersOrderBy["OfferbucketAsc"] = "OFFERBUCKET_ASC";
    OffersOrderBy["OfferbucketDesc"] = "OFFERBUCKET_DESC";
    OffersOrderBy["ImageAsc"] = "IMAGE_ASC";
    OffersOrderBy["ImageDesc"] = "IMAGE_DESC";
    OffersOrderBy["PrimaryKeyAsc"] = "PRIMARY_KEY_ASC";
    OffersOrderBy["PrimaryKeyDesc"] = "PRIMARY_KEY_DESC";
})(OffersOrderBy = exports.OffersOrderBy || (exports.OffersOrderBy = {}));
