export class Message {

    constructor(
        public userId: string,
        public text: string,
        public timestamp: any
    ) {}


    create(message: Message, listMessages: AngularFireList<Message>): Promise<void> {
        return Promise.resolve(listMessages.push(message));
      }
    
      getMessages(userId1: string, userId2: string): AngularFireList<Message> {    
        console.log(userId1, userId2);
        
        return this.db.list(`/messages/${userId1}-${userId2}`, 
          (ref: firebase.database.Reference) => ref.limitToLast(30).orderByChild('timestamp')
        );
      }
}