class File {
    constructor(id, user, file, name, size, content_type, prediction_file, created_at) { 
        this.id = id;
        this.user = user;
        this.file = file;
        this.name = name;
        this.size = size;
        this.content_type = content_type;
        this.prediction_file = prediction_file;
        this.created_at = created_at;
    }
};

export default File;