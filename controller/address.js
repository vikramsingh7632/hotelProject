const model = require("./../models");

 async function createAddress (req, res)  {
  try {
    const data = req.body;
    const newAddress = new address(data);
    const response = await newAddress.save();
    console.log("Data saved successfully");
    res.status(201).json(response);
    console.log('response: ', response); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function listing (req, res){
    try {
      let page = parseInt(req.query.page) 
      let limit = parseInt(req.query.limit) 
      let skip = (page - 1) * limit;
  
      const aggree = await Address.aggregate([
        { $match: { isDeleted: false } },
  
        {
          $lookup: {
            from: "people",
            localField: "personId",
            foreignField: "_id",
            as: "peoples",
          },
        },
        { $unwind: "$peoples" },
  
        {
          $project: {
            "peoples.name": 1,
            "peoples.email": 1,
            "peoples.mobileNum": 1,
            street: 1,
            city: 1,
            state: 1,
            pincode: 1,
            country: 1,
          },
        },
  
        { $skip: skip },
        { $limit: limit },
      ]);
  
      const totalCount = await Address.countDocuments({ isDeleted: false });
  
      res.json({
        totalRecords: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        data: aggree,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
  async function addressByUserId (req, res){
    try {
      const personId = req.params.id;
      console.log('personId: ', personId);
      const addressUser= await model.address.find({ personId: personId });
      console.log('addressUser: ', addressUser);
      res
        .status(200)
        .json({ data: addressUser, message: "sucess data are fetched" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "internal server error", error: error.message });
    }
  }

module.exports ={
    createAddress,
    listing,
    addressByUserId,
}