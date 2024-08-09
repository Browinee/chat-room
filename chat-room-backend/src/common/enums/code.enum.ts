export enum AppHttpCode {
  /** 公共錯誤 */
  /** 伺服器出錯 */
  SERVICE_ERROR = 500500,
  /** 數據為空 */
  DATA_IS_EMPTY = 100001,
  /** 參數有誤 */
  PARAM_INVALID = 100002,
  /** 檔案類型錯誤 */
  FILE_TYPE_ERROR = 100003,
  /** 檔案超出大小 */
  FILE_SIZE_EXCEED_LIMIT = 100004,
  /** 創建用戶已存在，手機號，電子郵件，用戶名等 */
  USER_CREATE_EXISTING = 200001,
  /** 兩次密碼輸入不一致，帳號密碼不一致等 */
  USER_PASSWORD_INVALID = 200002,
  /** 帳號被禁用 */
  USER_ACCOUNT_FORBIDDEN = 200003,
  /** 用戶狀態更改，當前用戶與修改用戶一致 */
  USER_FORBIDDEN_UPDATE = 20004,
  /** 用戶不存在 */
  USER_NOT_FOUND = 200004,
  /** 角色未找到 */
  ROLE_NOT_FOUND = 300004,
  /** 角色不可刪除 */
  ROLE_NOT_DEL = 300005,
  /** 無權限 */
  ROLE_NO_FORBIDDEN = 300403,
  /** 選單未找到 */
  MENU_NOT_FOUND = 400004,
  /** 部門不存在 */
  DEPT_NOT_FOUND = 500004,
  /** 職位已存在 */
  POST_REPEAT = 600001,
  /** 職位不存在 */
  POST_NOT_FOUND = 600004,
}