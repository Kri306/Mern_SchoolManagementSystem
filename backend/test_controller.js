const SchoolController = require('./controller/super-admin/schoolController');

async function test() {
  const req = {};
  const res = {
    status: function(code) {
      console.log('Response Status:', code);
      return this;
    },
    json: function(data) {
      console.log('Response JSON:', JSON.stringify(data, null, 2));
      return this;
    }
  };

  console.log('Calling SchoolController.getSchoolAdmins...');
  try {
    await SchoolController.getSchoolAdmins(req, res);
  } catch (err) {
    console.error('Caught error:', err);
  }
}

test();
