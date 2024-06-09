# API Docs Giziwise

## Table of Contents

- Sign Up
- Sign In
- BMI Calculator
- Me/Profile
- Logout

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
| token     | String | Token       |

## BMI Calculator

- [POST] /bmi
- Cookie token

### Request Body
| Parameter          | Type   | Description   |
| ------------------ | ------ | ------------- |
| weight             | int    | Weight in kg  |
| height             | int    | Height in cm  |
| dob                | date   | Date of birth |
| gender             | String | Gender        |

### Response
| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| message   | String | Message     |

- [GET] /bmi
- Cookie token

### Response
| Parameter          | Type   | Description         |
| ------------------ | ------ | ------------------- |
| id                 | int    | Id for store BMI    |
| user_id            | int    | Id from user        |
| bmi                | float  | Score BMI           |
| category           | String | Weight category     |
| weight             | int    | Weight in kg        |
| height             | int    | Height in cm        |
| age                | int    | Age                 |
| gender             | String | Gender              |
| healthyWeightRange | String | Mantain good weight |
| calory             | float  | Total calories      |

- [GET] /bmi/{id}
- Cookie token

### Response
| Parameter          | Type   | Description         |
| ------------------ | ------ | ------------------- |
| bmi                | float  | Score BMI           |
| category           | String | Weight category     |
| weight             | int    | Weight in kg        |
| height             | int    | Height in cm        |
| age                | int    | Age                 |
| gender             | String | Gender              |
| healthyWeightRange | String | Mantain good weight |
| calory             | float  | Total calories      |

## Me/Profile

- [GET] /me
- Cookie token

### Response
| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| message   | String | Message     |
| email     | String | email       |

## Logout

- [POST] /logout
- Cookie token

### Response
| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| message   | String | Message     |
