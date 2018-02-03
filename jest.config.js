module.exports = {
    "setupFiles": ["jest-localstorage-mock", "jest-fetch-mock"],

    "moduleFileExtensions": ["js", "jsx"],
    "moduleDirectories": ["node_modules"],

    "moduleNameMapper": {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
        "\\.(css|less)$": "identity-obj-proxy",

        "Account": "<rootDir>/app/components/account/account.jsx",
        "Greeter": "<rootDir>/app/components/greeter/greeter.jsx",
        "Help": "<rootDir>/app/components/help/help.jsx",
        "Login": "<rootDir>/app/components/login/login.jsx",
        "Message": "<rootDir>/app/components/message/message.jsx",
        "Messenger": "<rootDir>/app/components/messenger/messenger.jsx",
        "Notification": "<rootDir>/app/components/notification/notification.jsx",

        "InitialState": "<rootDir>/__mocks__/dafaultStateMock.js",

        // Webpack alias config
        "^Widgets(.*)$": "<rootDir>/app/widgets$1",
        "^Components(.*)$": "<rootDir>/app/components$1",
        "^Common(.*)$":  "<rootDir>/app/common$1",
        "^Images(.*)$": "<rootDir>/app/images$1",
        "^Vendor(.*)$": "<rootDir>/app/vendor$1",

        "Services": "<rootDir>/app/common/services/service-directory.js",
        "ServiceManager": "<rootDir>/app/common/services/service-manager.js"
    }
};