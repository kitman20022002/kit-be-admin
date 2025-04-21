
export {};

function transformResponse(doc:any, ret:any) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
}

exports.plugin = (schema:any) => {
  schema.set('toJSON', {
    transform: function (doc:any, ret:any) {
      transformResponse(doc, ret);
    },
    versionKey: false, 
  });
};