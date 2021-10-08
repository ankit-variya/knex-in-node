// const express = require('express');
// var router = express.Router();
const { insert, findById, list, update, deletedata } = require('../models/commonModel');
const { postsValidationSchema } = require('../validation');
const Joi = require("joi");

let tableName = 'posts';
let validationSchema;


const handleActions = async (req, res, next) => {
    let body = req.body;
    const { action } = req.params;

    try {
        const result = await actionResponse(action, body)
        console.log('result', result)
        res.send({
            data: result
        })
    } catch (error) {
        res.send({
            error: error.message
        })
    }
}

const actionResponse = async (action, body) => {
    await validate(action, body);

    let table = await actionModel(action, body);
    console.log('table', table)
    return table
}

const validate = async (action, body) => {

    switch (action) {
        case "create":
            validationSchema = postsValidationSchema;
            break;
    }

    // console.log('--body', body)
    // console.log('typeof validationSchema', typeof validationSchema)
    if (typeof validationSchema != "undefined") {
        const validateData = validationSchema.validate(body);

        if (validateData.error && validateData.error !== null) {
            throw new Error(validateData.error.message);
        }

        return validateData;
    }
}


const actionModel = async (action, body) => {
    console.log('.......actionmodel', action)
    switch (action) {
        case "create":
            const createPost = await postsCreate(body);
            return createPost;

        case "list":
            const listPost = await postList(body);
            return listPost;

        case "update":
            const updatePost = await postUpdate(body);
            return updatePost;

        case "delete":
            const deletePost = await postDelete(body);
            return deletePost;


        default:
            throw new Error("action not proper");
    }
}

const postsCreate = async (body) => {
    //  const body = req.body;
    const postObj = {
        title: body.title,
        description: body.description
    }

    const insertedData = await insert(tableName, postObj);
    if (!insertedData.data) throw new Error('data is not inserted');

    const record = await findById(tableName, { 'id': insertedData.data[0] })
    return record.data;
}

const postList = async (body) => {
    const listData = await list(tableName);
    if (!listData.data) throw new Error('data is not found');
    return listData;
}

const postUpdate = async (body) => {
    console.log('body', body)
    const updateObj = {
        title: body.title,
        description: body.description
    }
    const finddata = await findById(tableName, { 'id': body.id })
    console.log('finddata', finddata.data)
    if (!finddata.data) throw new Error('data is not find');

    const updateData = await update(tableName, { 'id': body.id }, updateObj);
    console.log('updateData', updateData)
    if (!updateData.data) throw new Error('data is not updated');

  //  const record = await findById(tableName, { 'id': updateData.data })
    const record = await findById(tableName, { 'id': body.id })
    return record.data;
}

const postDelete = async (body) => {
    const finddata = await findById(tableName, { 'id': body.id })
    if (!finddata.data) throw new Error('data is not find');

    const deleteData = await deletedata(tableName, { 'id': body.id });
    if (!deleteData.data) throw new Error('data is not deleted');

    return deleteData;
}

module.exports = handleActions;