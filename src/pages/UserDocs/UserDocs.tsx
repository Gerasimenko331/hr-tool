import { DateTime } from 'luxon';
import React, {useState, useEffect, useCallback} from 'react';
import './UserDocs.css';
import {
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
    Tooltip,
    IconButton
} from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';

import { fetchUserDocs, addUserDoc, updateUserDoc, deleteUserDoc } from '../../api/userdocs/userdocs';

type ItemT = {
    id: string;
    companySigDate: string;
    companySignatureName: string;
    documentName: string;
    documentStatus: string;
    documentType: string;
    employeeNumber: string;
    employeeSigDate: string;
    employeeSignatureName: string;
}

const initialItem: ItemT = {
    id: '',
    companySigDate: '',
    companySignatureName: '',
    documentName: '',
    documentStatus: '',
    documentType: '',
    employeeNumber: '',
    employeeSigDate: '',
    employeeSignatureName: ''
}

export function UserDocs() {
    const [items, setItems] = useState<any[]>([]);
    const [editableItems, setEditableItems] = useState<ItemT[]>([]);
    const [isAddMode, setIsAddMode] = useState(false);
    const [newRow, setNewRow] = useState<ItemT>(initialItem);
    const [isLoading, setIsLoading] = useState(false);
    const [isNeedToReload, setIsNeedToReload] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const results = await fetchUserDocs();
            setItems(results);
            setIsNeedToReload(false);
        };
        if (isNeedToReload) {
            fetchData();
        }
    }, [isAddMode, isNeedToReload]);

    const handleInputChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        const itemId = name.includes("_") ? name.substring(name.indexOf("_") + 1) : null;
        if (!itemId) {
            setNewRow({...newRow, [name]: value});
        } else {
            const propName = name.substring(0, name.indexOf("_"));
            const index = editableItems.findIndex(item => item.id === itemId);
            const newEditableItems = [
                ...editableItems.slice(0, index),
                { ...editableItems[index], [propName]: value },
                ...editableItems.slice(index + 1)
            ];
            setEditableItems(newEditableItems);
        }
    };

    const handleClickButtonAdd = () => {
        setIsAddMode(true);
    };

    const handleClickButtonEdit = (item: ItemT) => {
        setEditableItems([...editableItems, item]);
    };

    const handleDelete = async (id: string) => {
        setIsLoading(true);
        const errorMsg = await deleteUserDoc(id);
        setIsLoading(false);
        setErrorMessage(errorMsg);
        if (!errorMsg) {
            setIsNeedToReload(true);
        }
    };

    const handleSave = async (itemId: string) => {
        const editableItem = editableItems.find(item => item.id === itemId);
        setIsLoading(true);
        const errorMsg = await updateUserDoc(editableItem);
        setIsLoading(false);
        setErrorMessage(errorMsg);
        if (!errorMsg) {
            handleCancel(itemId);
            setIsNeedToReload(true);
        }
    };

    const handleAdd = async (item: ItemT) => {
        setIsLoading(true);
        const errorMsg = await addUserDoc(item);
        setIsLoading(false);
        setErrorMessage(errorMsg);
        if (!errorMsg) {
            setIsAddMode(false);
            setIsNeedToReload(true);
        }
    };

    const handleCancel = (id: string) => {
        const activeItemIndex = editableItems.findIndex(editableItem => editableItem.id === id);
        const newEditableItems = [
            ...editableItems.slice(0, activeItemIndex),
            ...editableItems.slice(activeItemIndex + 1)
        ]
        setEditableItems(newEditableItems);
    };

    const handleCancelAdded = () => {
        setIsAddMode(false);
        setNewRow(initialItem);
    };

    const getFormattedDate =  useCallback(
        (value: string) => {
            try {
                const dateTimeValue = DateTime.fromISO(value);
                return dateTimeValue.isValid ? dateTimeValue.toFormat('yyyy-MM-dd HH:mm') : (value === null ? '' : value);
            } catch (error) {
                return '';
            }
        },
        []
    );

    return (
        <div className="container">
            <h1>User Documents</h1>
            {isLoading && <div className="loaderContainer"><CircularProgress /></div>}
            {errorMessage && <Typography variant="body1" color="error" paragraph>{errorMessage}</Typography>}
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead  className="tableHeader">
                        <TableRow>
                            <TableCell align="center">Company Sig Date</TableCell>
                            <TableCell align="center">Company Signature Name</TableCell>
                            <TableCell align="center">Document Name</TableCell>
                            <TableCell align="center">Document Status</TableCell>
                            <TableCell align="center">Document Type</TableCell>
                            <TableCell align="center">Employee Number</TableCell>
                            <TableCell align="center">Employee Sig Date</TableCell>
                            <TableCell align="center">Employee Signature Name</TableCell>
                            <TableCell  align="center">
                                <Tooltip title="Add" enterDelay={0}>
                                    <IconButton onClick={handleClickButtonAdd}>
                                        <AddCircleOutlineIcon color="info" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item: ItemT) => {
                            const activeItem = editableItems.find(editableItem => item.id === editableItem.id );
                            return activeItem ?
                            (<TableRow
                                key={item.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>
                                    <TextField name={`companySigDate_${item.id}`} value={getFormattedDate(activeItem.companySigDate)} onChange={handleInputChange} placeholder="Company Sig Date" />
                                </TableCell>
                                <TableCell>
                                    <TextField name={`companySignatureName_${item.id}`} value={activeItem.companySignatureName} onChange={handleInputChange} placeholder="Company Signature Name" />
                                </TableCell>
                                <TableCell>
                                    <TextField name={`documentName_${item.id}`} value={activeItem.documentName} onChange={handleInputChange} placeholder="Document Name" />
                                </TableCell>
                                <TableCell>
                                    <TextField name={`documentStatus_${item.id}`} value={activeItem.documentStatus} onChange={handleInputChange} placeholder="Document Status" />
                                </TableCell>
                                <TableCell>
                                    <TextField name={`documentType_${item.id}`} value={activeItem.documentType} onChange={handleInputChange} placeholder="Document Type" />
                                </TableCell>
                                <TableCell>
                                    <TextField name={`employeeNumber_${item.id}`} value={activeItem.employeeNumber} onChange={handleInputChange} placeholder="Employee Number" />
                                </TableCell>
                                <TableCell>
                                    <TextField name={`employeeSigDate_${item.id}`} value={getFormattedDate(activeItem.employeeSigDate)} onChange={handleInputChange} placeholder="Employee Sig Date" />
                                </TableCell>
                                <TableCell>
                                    <TextField name={`employeeSignatureName_${item.id}`} value={activeItem.employeeSignatureName} onChange={handleInputChange} placeholder="Employee Signature Name" />
                                </TableCell>
                                <TableCell>
                                    <div className="actionButtons">
                                      <Tooltip title="Save" enterDelay={0}>
                                        <IconButton onClick={() => handleSave(item.id)}>
                                            <CheckCircleIcon  color="success"/>
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Cancel" enterDelay={0}>
                                        <IconButton onClick={() => handleCancel(item.id)}>
                                            <ClearIcon  color="info"/>
                                        </IconButton>
                                      </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>) :
                            (<TableRow
                                    key={item.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{getFormattedDate(item.companySigDate)}</TableCell>
                                <TableCell align="center">{item.companySignatureName}</TableCell>
                                <TableCell align="center">{item.documentName}</TableCell>
                                <TableCell align="center">{item.documentStatus}</TableCell>
                                <TableCell align="center">{item.documentType}</TableCell>
                                <TableCell align="center">{item.employeeNumber}</TableCell>
                                <TableCell align="center">{getFormattedDate(item.employeeSigDate)}</TableCell>
                                <TableCell align="center">{item.employeeSignatureName}</TableCell>
                                <TableCell>
                                    <div className="actionButtons">
                                        <Tooltip title="Edit" enterDelay={0}>
                                            <IconButton onClick={() => handleClickButtonEdit(item)}>
                                                <ModeIcon color="info" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete" enterDelay={0}>
                                            <IconButton onClick={() => handleDelete(item.id)}>
                                                <DeleteOutlineIcon color="error"/>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>)}
                        )}
                        {isAddMode &&
                            <TableRow>
                                <TableCell>
                                    <TextField name="companySigDate" value={newRow.companySigDate} onChange={handleInputChange} placeholder="CompanySigDate" />
                                </TableCell>
                                <TableCell>
                                    <TextField name="companySignatureName" value={newRow.companySignatureName} onChange={handleInputChange} placeholder="CompanySignatureName" />
                                </TableCell>
                                <TableCell>
                                    <TextField name="documentName" value={newRow.documentName} onChange={handleInputChange} placeholder="DocumentName" />
                                </TableCell>
                                <TableCell>
                                    <TextField name="documentStatus" value={newRow.documentStatus} onChange={handleInputChange} placeholder="DocumentStatus" />
                                </TableCell>
                                <TableCell>
                                    <TextField name="documentType" value={newRow.documentType} onChange={handleInputChange} placeholder="DocumentType" />
                                </TableCell>
                                <TableCell>
                                    <TextField name="employeeNumber" value={newRow.employeeNumber} onChange={handleInputChange} placeholder="EmployeeNumber" />
                                </TableCell>
                                <TableCell>
                                    <TextField name="employeeSigDate" value={newRow.employeeSigDate} onChange={handleInputChange} placeholder="EmployeeSigDate" />
                                </TableCell>
                                <TableCell>
                                    <TextField name="employeeSignatureName" value={newRow.employeeSignatureName} onChange={handleInputChange} placeholder="EmployeeSignatureName" />
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Save" enterDelay={0}>
                                        <IconButton onClick={() => handleAdd(newRow)} aria-label="Save">
                                            <CheckCircleIcon  color="success"/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cancel" enterDelay={0}>
                                        <IconButton onClick={handleCancelAdded}>
                                            <ClearIcon color="info"/>
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
