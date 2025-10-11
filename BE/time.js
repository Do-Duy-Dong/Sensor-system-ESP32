const dayjs= require('dayjs');

module.exports = (keyword)=>{
    const date= keyword.split(" ");
    const time= dayjs();
    let start,end;
    let arr= date[0]?.split(":");
    if(arr.length==3){
        start= time.hour(arr[0]).minute(arr[1]).second(arr[2]).millisecond(0);
        end= time.hour(arr[0]).minute(arr[1]).second(arr[2]).millisecond(999);
    }else if(arr.length==2){
        start= time.hour(arr[0]).minute(arr[1]).second(0).millisecond(0);
        end= time.hour(arr[0]).minute(arr[1]).second(59).millisecond(999);
    }else if(arr==1){
        start= time.hour(arr[0]).minute(0).second(0).millisecond(0);
        end= time.hour(arr[0]).minute(59).second(59).millisecond(999);
    }
    if(date.length ==2){
        let days= date[1].split("/");
        start= start.date(days[0]).month(days[1]-1).year(days[2]);
        end= end.date(days[0]).month(days[1]-1).year(days[2]);
    }
    return {start: start.toDate(), end: end.toDate()};
}