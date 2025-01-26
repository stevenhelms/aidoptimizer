class File {
  constructor(id, user, fileDetails) {
    this.id = id;
    this.user = user;
    this.file = fileDetails.file;
    this.name = fileDetails.name;
    this.size = fileDetails.size;
    this.content_type = fileDetails.content_type;
    this.prediction_file = fileDetails.prediction_file;
    this.message = fileDetails.message;
    this.created_at = fileDetails.created_at;
  }
}

export default File;
