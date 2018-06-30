import React from 'react';

let BasicDetail = (function () {

    let getFullName = function () {
        return sessionStorage.getItem('fullName');
    };

    let setFullName = function (fullName) {
        sessionStorage.setItem('fullName', fullName);
    };


    let setAccessToken = function (accesstoken) {
        sessionStorage.setItem('accessToken', accesstoken);
    };

    let getAccessToken = function () {
        return sessionStorage.getItem('accessToken');
    };

    let clearAll = function () {

        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('fullName');
    };

    return {
        getFullName: getFullName,
        setFullName: setFullName,
        setAccessToken: setAccessToken,
        getAccessToken: getAccessToken,
        clearAll: clearAll
    }
})();

export default BasicDetail;
