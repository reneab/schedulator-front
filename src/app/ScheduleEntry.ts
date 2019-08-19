export class ScheduleEntry {

    constructor(public from: Date,
                public to: Date,
                public teacher: string,
                public batch: string,
                public room: string,
                public subject: string,
                public recurring: boolean,
                public id?: string) {}
}
