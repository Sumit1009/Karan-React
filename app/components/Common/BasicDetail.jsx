import React from 'react';

let BasicDetail = (function () {

    let getUserId = function () {
        return sessionStorage.getItem('userId');
    };

    let setUserId = function (userId) {
        sessionStorage.setItem('userId', userId);
    };

    let getFullName = function () {
        return sessionStorage.getItem('fullName');
    };

    let setFullName = function (fullName) {
        sessionStorage.setItem('fullName', fullName);
    };

    let getPremiseName = function () {
        return sessionStorage.getItem('premiseName');
    };

    let setPremiseName = function (premiseName) {
        sessionStorage.setItem('premiseName', premiseName);
    };

    let setAccessToken = function (accesstoken) {
        sessionStorage.setItem('accessToken', accesstoken);
    };

    let getAccessToken = function () {
        return sessionStorage.getItem('accessToken');
    };

    let setRole = function (roleUser) {
        sessionStorage.setItem('role', roleUser);
    };

    let getRole = function () {
        return sessionStorage.getItem('role');
    };

    let getPremiseId = function () {
        return sessionStorage.getItem('premiseId');
    };

    let setPremiseId = function (premiseid) {
        sessionStorage.setItem('premiseId', premiseid);
    };

    let getCurrencySymbolCode = function () {
        return <span style={{fontFamily: 'Arial'}}
                     dangerouslySetInnerHTML={{__html: sessionStorage.getItem('currencySymbolCode')}}/>
    };

    let setCurrencySymbolCode = function (userName) {
        sessionStorage.setItem('currencySymbolCode', userName);
    };

    let clearAll = function () {

        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('fullName');
        sessionStorage.removeItem('premiseId');
        sessionStorage.removeItem('premiseName');
        sessionStorage.removeItem('premiseAutoCompleteId');
        sessionStorage.removeItem('ParameterComponent');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('currencySymbolCode');
    };

    return {
        getUserId: getUserId,
        setUserId: setUserId,
        getFullName: getFullName,
        setFullName: setFullName,
        getPremiseName: getPremiseName,
        setPremiseName: setPremiseName,
        setAccessToken: setAccessToken,
        getAccessToken: getAccessToken,
        setRole: setRole,
        getRole: getRole,
        getPremiseId: getPremiseId,
        setPremiseId: setPremiseId,
        getCurrencySymbolCode: getCurrencySymbolCode,
        setCurrencySymbolCode: setCurrencySymbolCode,
        clearAll: clearAll
    }
})();

export default BasicDetail;
