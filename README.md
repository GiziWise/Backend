# Architechture

# Description
This project is source code to handle backend for GiziWise Application.
Build using node.js and hapi framework, deployment using cloud run, cloud sql services of GCP.

# How to use
- Clone this repo
- Install mysql 5.7 and import giziwise.sql, example ``
- 

# API Docs Giziwise

## Table of Contents

- [Sign Up](#sign-up)
- [Sign In](#sign-in)
- [BMI Calculator](#bmi-calculator)
- [Predict food](#predict-food)
- [Me/Profile](#meprofile)
- [Logout](#logout)
- [Error code](#error-code)

## Sign Up

- [POST] /signup

### Request Body
| Parameter         | Type   | Required | Description      |
| ----------------- | ------ | -------- | ---------------- |
| nama              | String | Yes      | Email            |
| email             | String | Yes      | Email            |
| password          | String | Yes      | Password         |
| confirmPassword   | String | Yes      | Confirm Password |

### Response
| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| message   | String | Message     |

```
{
    "status": "success",
    "message": "User created successfully"
}
```

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

```
{
    "status": "success",
    "message": "Login successfully",
    "data": {
        "id": 8,
        "token": "token jwt"
    }
}
```

## BMI Calculator

- [POST] /bmi
- Cookie token

### Request Body
| Parameter          | Type   | Description   |
| ------------------ | ------ | ------------- |
| weight             | int    | Weight in kg  |
| height             | int    | Height in cm  |
| gender             | String | Gender        |
| dob                | date   | Date of birth |


### Response
| Parameter          | Type   | Description         |
| ------------------ | ------ | ------------------- |
| message            | String | Message             |

```
{
    "status": "success",
    "message": "BMI data saved successfully"
}
```
- [GET] /bmi
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

```
{
    "status": "success",
    "databmi": {
        "bmi": 24.2,
        "category": "Normal",
        "weight": 70,
        "height": 170,
        "age": 24,
        "gender": "male",
        "healthyWeightRange": "53.5 kg - 72 kg",
        "calory": 2046.9
    }
}
```
## Predict food
- [POST] /predict
- Cookie token

### Request body
| Parameter    | Type   | Description   |
| ------------ | ------ | ------------- |
| nama_makanan | String | Nama          |
| portion_size | float  | Portion size  |

### Response
| Parameter | Type   | Description      |
| --------- | ------ | ---------------- |
| makanan   | string | nama makanan     |
| energi    | float  | energi per porsi |
| lemak     | float  | lemak makanan    |
| protein   | float  | protein maknan   |

```
{
    "status": "success",
    "dataprediksi": {
        "makanan": "Nasi",
        "energi": 89.21,
        "lemak": 1.52,
        "protein": 1.52
    }
}
```
- [GET] /predict
- Cookie token

### Response
| Parameter | Type   | Description      |
| --------- | ------ | ---------------- |
| makanan   | string | nama makanan     |
| energi    | float  | energi per porsi |
| lemak     | float  | lemak makanan    |
| protein   | float  | protein maknan   |

```
{
    "status": "success",
    "datamakanan": [
        {
            "nama_makanan": "Gemblong",
            "energi": 210.3,
            "lemak": 40.5,
            "protein": 12.75
        },
        {
            "nama_makanan": "Nasi",
            "energi": 88.33,
            "lemak": 1.5,
            "protein": 1.5
        }
    ]
}
```

## Me/Profile

- [GET] /me
- Cookie token

### Response
| Parameter | Type   | Description   |
| --------- | ------ | ------------- |
| nama      | String | Nama          |
| email     | String | email         |
| dob       | date   | Date of birth |
| gender    | String | Gender        |
| age       | int    | Age           |
| height    | int    | Height        |
| weight    | int    | Weight        |


```
{
    "status": "success",
    "dataakun": {
        "id": 8,
        "nama": "namaaku",
        "email": "test@example.com",
        "bmi": {
            "dob": "1999-12-31T17:00:00.000Z",
            "gender": "male",
            "age": 24,
            "weight": 70,
            "height": 170
        }
    }
}
```

## Logout

- [POST] /logout
- Cookie token

### Response
| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| message   | String | Message     |

```
{
    "status": "success",
    "message": "Logout successfully",
}
```

## Error code
### Success
200 OK
```
{
    "status": "success",
    "message": "Login successfully",
}
```
201 Created

```
{
    "status": "success",
    "message": "User created successfully"
}
```
### Client error
400 Bad request
```
{
    "status": "fail",
    "message": "Must be a valid date of birth"
}
```
401 Unauthorized
```
{
    "status": "fail",
    "message": "Unauthorized"
}
```
404 Not found
```
{
    "status": "fail",
    "message": "User not found"
}
```
### Server error
500
```
{
    "status": "fail",
    "message": "Internal Server Error"
}
```