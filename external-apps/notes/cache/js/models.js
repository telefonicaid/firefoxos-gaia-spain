var User = function(initOptions) {
    var self = this;
    
    this.data_id = "";
    this.data_username = "";
    this.data_name = "";
    this.data_date_created = "";
    this.data_metadata = {};
    
    function init(options) {
        updateObject(self, options);
        validate();
    }
    
    this.set = function(options, cbSuccess, cbError) {
        updateObject(self, options);
        validate();
        
        DB.updateUser(self, cbSuccess, cbError);
        
        return self;
    };
    
    this.newNotebook = function(options, cbSuccess, cbError) {
        options.user_id = self.getId();
        
        var notebook = new Notebook(options);
        DB.addNotebook(notebook, function(){
            cbSuccess && cbSuccess(notebook);
        });
    };
    
    this.getNotebooks = function(cbSuccess, cbError) {
        DB.getNotebooks({"user_id": self.data_id, "trashed": false}, cbSuccess, cbError);
    };
    
    this.getTrashedNotes = function(cbSuccess, cbError) {
        DB.getNotes({"trashed": true}, cbSuccess, cbError);
    };
    
    this.getNotes = function(filters, cbSuccess, cbError) {
        DB.getNotes(filters, cbSuccess, cbError);
    };
    
    this.getId = function() { return self.data_id; };
    this.getDateCreated = function() { return self.data_date_created; };
    
    function validate() {
        if (!self.data_id) {
            self.data_id = "user_" + Math.round(Math.random()*100000);
        }
        
        if (!self.data_date_created) {
            self.data_date_created = new Date().getTime();
        }
    }
    
    init(initOptions);
};

var Notebook = function(initOptions) {
    var self = this;
    
    this.data_id = "";
    this.data_name = "";
    this.data_user_id = "";
    this.data_date_created = "";
    this.data_date_updated = "";
    this.data_metadata = {};
    
    this.data_trashed = false;
    this.data_numberOfNotes = 0;
    this.data_numberOfTrashedNotes = 0;
    
    function init(options) {
        updateObject(self, options);
        validate();
    }
    
    this.set = function(options, cbSuccess, cbError) {
        updateObject(self, options);
        validate();
        
        DB.updateNotebook(self, cbSuccess, cbError);
        
        return self;
    };
    
    this.newNote = function(options, cbSuccess, cbError) {
        if (!options) {
            options = {};
        }
        
        options.notebook_id = self.getId();
        
        var note = new Note(options);
        DB.addNote(note, function onSuccess(){
            self.updateNotesCount(function onSuccess() {
                cbSuccess && cbSuccess(note);
            }, cbError);
        }, cbError);
    };
    
    this.getNotes = function(bIncludeTrashed, cbSuccess, cbError) {
        var filters = {
            "notebook_id": self.getId()
        };
        if (!bIncludeTrashed) {
            filters.trashed = false;
        }
        
        DB.getNotes(filters, cbSuccess, cbError);
        
        return self;
    };
    this.getTrashedNotes = function(cbSuccess, cbError) {
        var filters = {
            "notebook_id": self.getId(),
            "trashed": true
        };
        
        DB.getNotes(filters, cbSuccess, cbError);
        
        return self;
    };
    
    this.trash = function(cbSuccess, cbError) {
        if (self.data_trashed) {
            return;
        }
        
        DB.updateMultiple("notes", {"notebook_id": self.getId()}, {"trashed": true}, function(){
            self.updateNotesCount(cbSuccess, cbError, {"trashed": true});
        }, cbError);
    };
    
    this.restore = function(cbSuccess, cbError) {
        if (!self.data_trashed) {
            return;
        }
        
        self.set({
            "trashed": false
        }, cbSuccess, cbError);
    };
    
    this.updateNotesCount = function(cbSuccess, cbError, options) {
        if (!options) {
            options = {};
        }
        
        self.getNotes(true, function(notes) {
            options.numberOfNotes = 0;
            options.numberOfTrashedNotes = 0;
            
            for (var i=0; i<notes.length; i++) {
                if (notes[i].isTrashed()) {
                    options.numberOfTrashedNotes++;
                } else {
                    options.numberOfNotes++;
                }
            }
            
            self.set(options, cbSuccess, cbError);
        }, cbError);
    };
    
    this.getId = function() { return self.data_id; };
    this.getName = function() { return self.data_name; };
    this.getUserId = function() { return self.data_user_id; };
    this.getTrashed = function() { return self.data_trashed; };
    this.getNumberOfNotes = function() { return self.data_numberOfNotes; };
    this.getNumberOfTrashedNotes = function() { return self.data_numberOfTrashedNotes; };

    init(initOptions);
    
    function validate() {
        if (!self.data_id){
            self.data_id = "nb_" + new Date().getTime() + "_" + Math.round(Math.random()*100000);
        }
        if (!self.data_date_created) {
            self.data_date_created = new Date().getTime();
        }
        if (!self.data_date_modified) {
            self.data_date_updated = new Date().getTime();
        }
        
        (self.data_numberOfNotes < 0) && (self.data_numberOfNotes = 0);
        (self.data_numberOfTrashedNotes < 0) && (self.data_numberOfTrashedNotes = 0);
    }
};

var Note = function(initOptions) {
    var self = this;
    
    this.data_id = "";
    this.data_title = "";
    this.data_text = "";
    this.data_country = "";
    this.data_city = "";
    this.data_date_created = null;
    this.data_date_updated = null;
    this.data_trashed = false;
    this.data_notebook_id = null;
    this.data_metadata = {};
    
    function init(options) {
        updateObject(self, options);
        validate();
    }
    
    this.set = function(options, cbSuccess, cbError) {
        updateObject(self, options);
        validate();
        
        self.data_date_updated = new Date().getTime();
        
        DB.updateNote(self, cbSuccess, cbError);
        
        return self;
    };
    
    this.trash = function(cbSuccess, cbError) {
        if (self.data_trashed) return;
        
        self.set({"trashed": true}, function onSuccess() {
            self.updateNotebookNotesCount(cbSuccess, cbError);
        }, cbError);
    };
    
    this.restore = function(cbSuccess, cbError) {
        if (!self.data_trashed) return;
        
        self.set({"trashed": false}, function onSuccess() {
            self.updateNotebookNotesCount(cbSuccess, cbError, {"trashed": false});
        }, cbError);
    };
    
    this.remove = function(cbSuccess, cbError) {
        DB.removeNote(self, function() {
            self.updateNotebookNotesCount(cbSuccess, cbError);
        }, cbError);
    };
    
    this.getNotebook = function(cbSuccess, cbError) {
        DB.getNotebooks({"id": self.getNotebookId()}, function(notebooks){
            cbSuccess && cbSuccess(notebooks[0]);
        }, cbError);
    };
    
    this.updateNotebookNotesCount = function(cbSuccess, cbError, additionalOptions) {
        self.getNotebook(function(notebook){
            notebook.updateNotesCount(cbSuccess, cbError, additionalOptions);
        }, cbError);
    };
    
    
    this.getResources = function(cbSuccess, cbError) {
        DB.getNoteResources({"noteId": self.getId()}, cbSuccess, cbError);
    };
    
    this.newResource = function(options, cbSuccess, cbError) {
        options.noteId = self.getId();
        
        var noteResource = new NoteResource(options);
        DB.addNoteResource(noteResource, function() {
            cbSuccess && cbSuccess(noteResource);
        });
    };
    
    this.getId = function() { return self.data_id; };
    this.getName = function() { return self.data_title; };
    this.getContent = function() { return self.data_text; };
    this.getDateCreated = function() { return self.data_date_created; };
    this.getDateUpdated = function() { return self.data_date_updated; };
    this.getNotebookId = function() { return self.data_notebook_id; };
    this.isTrashed = function() { return self.data_trashed; };
    
    init(initOptions);
    
    function validate() {
        if (!self.data_id) {
            self.data_id = "note_" + new Date().getTime() + "_" + Math.round(Math.random()*100000);
        }
        
        if (!self.data_date_created) {
            self.data_date_created = new Date().getTime();
        }
        
        if (!self.data_date_updated) {
            self.data_date_updated = new Date().getTime();
        }
    }
};

function NoteResource(initOptions) {
    var self = this;
    
    this.data_id = '';
    this.data_name = '';
    this.data_src = '';
    this.data_size = -1;
    this.data_type = '';
    this.data_noteId = '';
    this.data_metadata = {};
        
    function init(options) {
        updateObject(self, options);
        validate();
    }
    
    function validate() {
        if (!self.data_id) {
            self.data_id = "nr_" + new Date().getTime() + "_" + Math.round(Math.random()*100000);
        }
    }
    
    this.set = function(options, cbSuccess, cbError) {
        updateObject(self, options);
        validate();
        
        DB.updateNoteResource(self, cbSuccess, cbError);
        
        return self;        
    };
    
    this.remove = function(cbSuccess, cbError) {
        DB.removeNoteResource(self, cbSuccess, cbError);
    };
    
    this.getId = function() { return self.data_id; };
    this.getName = function() { return self.data_name; };
    this.getSrc = function() { return self.data_src; };
    this.getSize = function() { return self.data_size; };
    this.getType = function() { return self.data_type; };
    this.getNoteId = function() { return self.data_noteId; };
    
    init(initOptions);
}

var ResourceTypes = {
    "IMAGE": "image"
};

function updateObject(obj, options) {
    if (!options) return;
    for (var k in options) {
        obj['data_' + k] = options[k];
    }
}