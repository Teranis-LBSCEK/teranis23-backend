async function getCurrentDate() {

    const date = new Date();
    const ISToffSet = 330; //IST is 5:30
    const offset = ISToffSet*60*1000;
    const ISTTime = new Date(date.getTime()+offset);

    return new Date(ISTTime.toJSON().substring(0, 10));
};

module.exports = getCurrentDate;