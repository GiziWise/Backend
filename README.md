# API Docs Giziwise

## Table of Contents

- Sign Up
- Sign In
- BMI Calculator
- Sign Out [SOON]

## Sign Up

- [POST] /signup

### Request Body

| Parameter         | Type   | Required | Description      |
| ----------------- | ------ | -------- | ---------------- |
| email             | String | Yes      | Email            |
| password          | String | Yes      | Password         |
| confirm_password  | String | Yes      | Confirm Password |

### Response

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| message   | String | Message     |

## Sign In

- [POST] /signin

### Request Body

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| email     | String | Yes      | Email       |
| password  | String | Yes      | Password    |

### Response

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| message   | String | Message     |
| email     | String | Email       |
| token     | String | Token       |

## BMI Calculator

- [POST] /bmi

### Request Body

| Parameter          | Type   | Description   |
| ------------------ | ------ | ------------- |
| message            | String | Message       |
| weight             | String | Weight in kg  |
| height             | String | Height in cm  |
| dob                | String | Date of birth |
| gender             | String | Gender        |

- [GET] /bmi

### Response Body

| Parameter          | Type   | Description         |
| ------------------ | ------ | ------------------- |
| id                 | String | Id for store BMI    |
| user_id            | String | Id from user        |
| bmi                | String | Score BMI           |
| category           | String | Weight category     |
| weight             | String | Weight in kg        |
| height             | String | Height in cm        |
| age                | String | Age                 |
| gender             | String | Gender              |
| healthyWeightRange | String | Mantain good weight |
| calory             | String | Total calories      |

- [GET] /bmi/{id}

### Response Body

| Parameter          | Type   | Description         |
| ------------------ | ------ | ------------------- |
| bmi                | String | Score BMI           |
| category           | String | Weight category     |
| weight             | String | Weight in kg        |
| height             | String | Height in cm        |
| age                | String | Age                 |
| gender             | String | Gender              |
| healthyWeightRange | String | Mantain good weight |
| calory             | String | Total calories      |