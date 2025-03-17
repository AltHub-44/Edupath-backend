const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

const renderTemplate = async (data) => {
    const templatePath = path.join(__dirname, "../views/forgotPasswordTemplate.ejs");
    const template = fs.readFileSync(templatePath, "utf-8");
    return ejs.render(template, data);
};

module.exports = renderTemplate;