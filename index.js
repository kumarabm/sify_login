const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const YAML = require("yamljs")
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = YAML.load("./api.yaml")
const app = express()
require("dotenv").config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const port = 3001
const datetime = new Date()

mongoose.connect("mongodb://localhost:27017/sify_login")

app.use("/login/vel/docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc))

const Company = mongoose.model("Company", {
   
    companyName: {
        type: String,
        require: true
    },
    panNo: {
        type: String,
        require: true
    },
    address1:{
        type: String,
        require: true
    },
    
    city:{
        type: String,
        require: true
    },
    state:{
        type: String,
        require: true
    },
    country:{
        type: String,
        require: true
    },
    isActive:{
        type: Boolean,
        default:true
    }
})

const User = mongoose.model("User", {
    email: {
        type: String,
        require: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Company'
    },
    phoneNumber:{
        type: Number,
        require: true
    },
    firstName:{
        type: String,
        require: true
    },
    lastName:{
        type: String,
        require: true
    }

})


app.post('/login/add-user', async (req, res) => {
    const { companyName, panNo, email, address, city, state, country, isActive, phoneNumber, firstName, lastName } = req.body
    console.log(req.body);
    if (!companyName) { return res.send({ "status": 200, "message": "companyName Field is required" }) }
    if (!panNo) { return res.send({ "status": 200, "message": "panNo Field is required" }) }
    if (!email) { return res.send({ "status": 200, "message": "email Field is required" }) }
    if (!address) { return res.send({ "status": 200, "message": " address Field is required" }) }
    if (!city) { return res.send({ "status": 200, "message": " city Field is required" }) }
    if (!state ) { return res.send({ "status": 200, "message": "state Field is required" }) }
    if (!country ) { return res.send({ "status": 200, "message": "countryField is required" }) }
    if (!isActive ) { return res.send({ "status": 200, "message": " isActive Field is required" }) }
    if (!phoneNumber ) { return res.send({ "status": 200, "message": " phoneNumber Field is required" }) }
    if (!firstName ) { return res.send({ "status": 200, "message": " firstName Field is required" }) }
    if (!lastName ) { return res.send({ "status": 200, "message": " lastName Field is required" }) }
    if (!phoneNumber ) { return res.send({ "status": 200, "message": " phoneNumber Field is required" }) }
    try {
        const companySave = new Company({
            companyName: companyName,
            panNo: panNo,
            address: address,
            city: city,
            state: state,
            country: country,
            isActive: isActive 
           
        })
        await companySave.save()
        console.log("Company Details", companySave);
        let companyId = companySave._id;

        const userSave = new User({
            companyId:  companyId,
            email: email,
            phoneNumber: phoneNumber,
            firstName: firstName,
            lastName: lastName
        })
        await userSave.save()
        console.log(userSave)
        res.send({status: 201, message: 'New User Created Successfully'})
    } catch (e) {
        console.log(e)
        res.send(e)
        return
    }
})

app.get('/login/users', async (req, res) => {
	try {
		const userDetails = await User.find({})
        console.log(userDetails)
		res.status(200).send(userDetails)
	} catch (e) {
		console.log(e)
		res.send(e)
		return
	}
})
app.get('/test', async (req, res) => {
    res.send({
        "status": 200, "message"
            : "sify_login"
    })
})

app.listen(process.env.PORT, () => {
    console.log(`port is connected in ${process.env.PORT}`)
})