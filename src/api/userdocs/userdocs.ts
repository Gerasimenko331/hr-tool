import {BASE_URL} from '../consts';
import { DateTime } from 'luxon';
import { isIsoDate } from '../utils';

export async function fetchUserDocs() {
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            return;
        }
        const url = `${BASE_URL}/ru/data/v3/testmethods/docs/userdocs/get`;
        const headers = {
            'x-auth': authToken
        };

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        const results = await response.json();
        return results.data;
    } catch(error) {
        console.log(error);
    }
}

export async function addUserDoc(item: any) {
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            return 'access error';
        }
        const url = `${BASE_URL}/ru/data/v3/testmethods/docs/userdocs/create`;
        const headers = {
            'Content-Type': 'application/json',
            'x-auth': authToken
        };

        const {
            companySigDate,
            companySignatureName,
            documentName,
            documentStatus,
            documentType,
            employeeNumber,
            employeeSigDate,
            employeeSignatureName
        } = item;

        const companySigDateDateTime = DateTime.fromFormat(companySigDate, 'yyyy-MM-dd HH:mm');
        const companySigDateIsoString = companySigDateDateTime.toISO();

        const employeeSigDateDateTime = DateTime.fromFormat(employeeSigDate, 'yyyy-MM-dd HH:mm');
        const employeeSigDateIsoString = employeeSigDateDateTime.toISO();

        const body = JSON.stringify({
            companySigDate: companySigDateIsoString,
            companySignatureName,
            documentName,
            documentStatus,
            documentType,
            employeeNumber,
            employeeSigDate: employeeSigDateIsoString,
            employeeSignatureName
        });

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body,
        });

        const results = await response.json();
        return results.status === 200 ? null : results.title;
    } catch(error) {
        return (error as any).message || 'addUserDoc error';
    }
}

export async function updateUserDoc(item: any) {
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            return 'access error';
        }
        const url = `${BASE_URL}/ru/data/v3/testmethods/docs/userdocs/set/${item.id}`;
        const headers = {
            'Content-Type': 'application/json',
            'x-auth': authToken
        };

        const {
            companySigDate,
            companySignatureName,
            documentName,
            documentStatus,
            documentType,
            employeeNumber,
            employeeSigDate,
            employeeSignatureName
        } = item;

        const companySigDateIsoString = !companySigDate ? '' : isIsoDate(companySigDate) ? companySigDate : DateTime.fromFormat(companySigDate, 'yyyy-MM-dd HH:mm').toISO();
        const employeeSigDateIsoString = !employeeSigDate ? '' : isIsoDate(employeeSigDate) ? employeeSigDate : DateTime.fromFormat(employeeSigDate, 'yyyy-MM-dd HH:mm').toISO();

        const body = JSON.stringify({
            companySigDate: companySigDateIsoString,
            companySignatureName,
            documentName,
            documentStatus,
            documentType,
            employeeNumber,
            employeeSigDate: employeeSigDateIsoString,
            employeeSignatureName
        });

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body,
        });

        const results = await response.json();
        return results.status === 200 ? null : results.title;
    } catch(error) {
        return (error as any).message || 'updateUserDoc error';
    }
}

export async function deleteUserDoc(id: string) {
    try{
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            return 'access error';
        }
        const url = `${BASE_URL}/ru/data/v3/testmethods/docs/userdocs/delete/${id}`;
        const headers = {
            'x-auth': authToken
        };

        const response = await fetch(url, {
            method: 'POST',
            headers
        });

        const results = await response.json();
        return results.status === 200 ? null : results.title;
    } catch(error) {
        return (error as any).message || 'deleteUserDoc error';
    }
}
