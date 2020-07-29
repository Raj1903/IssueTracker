import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private baseUrl = "http://localhost:3000/api/v1/issue";

  constructor(
    private http: HttpClient
  ) { }

  /* Creating issues*/
  public createIssueFunction(data) {
    
    if (data.assigneeId && data.assigneeName) {
      const params = new HttpParams()
        .set('authToken', data.authToken)
        .set('title', data.title)
        .set('description', data.description)
        .set('status', data.status)
        .set('assigneeId', data.assigneeId)
        .set('assigneeName', data.assigneeName)
        

      return this.http.post(`${this.baseUrl}/create`, params);
    }
    else {
      const params = new HttpParams()
        .set('authToken', data.authToken)
        .set('title', data.title)
        .set('description', data.description)
        .set('status', data.status)
      return this.http.post(`${this.baseUrl}/create`, params)
    }
  }
  /*end of creating issues*/

  /* geeting all issues*/
    public getAllIssues(authToken, skip) {
    return this.http.get(`${this.baseUrl}/view/all?authToken=${authToken}&skip=${skip}`)
  }//end

  /*issue details by userId*/
  public getIssueDetail(issueId, authToken) {
    return this.http.get(`${this.baseUrl}/${issueId}/view?authToken=${authToken}`)
  }//end


 /* function to get issues*/
  public getIssuesAssigned(userId, authToken,skip) {
    return this.http.get(`${this.baseUrl}/${userId}/view/all?authToken=${authToken}&skip=${skip}`);
  }

  
  /*user report issue */
  public IssuesReportedByUser(userId, authToken, skip) {
    return this.http.get(`${this.baseUrl}/${userId}/reported/issues?authToken=${authToken}&skip=${skip}`);
  }

  

  /*Cooments on issue*/
  public addComment(data) {
    const params = new HttpParams()
      .set('authToken', data.authToken)
      .set('userId', data.userId)
      .set('firstName', data.firstName)
      .set('comment', data.comment)
      .set('issueId', data.issueId)

    return this.http.post(`${this.baseUrl}/comment/create`, params)
  }

 /*update*/
  public updateIssue(data) {
    if (data.assigneeId && data.assigneeName) {
      const params = new HttpParams()
        .set('title', data.title)
        .set('description', data.description)
        .set('status', data.status)
        .set('assigneeId', data.assigneeId)
        .set('assigneeName', data.assigneeName)
        .set('authToken', data.authToken)

        return this.http.put(`${this.baseUrl}/${data.issueId}/edit`,params)
    }
    else
    {
      const params = new HttpParams()
        .set('title', data.title)
        .set('description', data.description)
        .set('status', data.status)
        .set('authToken', data.authToken)

        return this.http.put(`${this.baseUrl}/${data.issueId}/edit`,params)
    }

  }

   /*issue service*/
   public searchIssue(authToken,searchText)
   {
     return this.http.get(`${this.baseUrl}/search/result?authToken=${authToken}&searchText=${searchText}`);
   }

  /*watching history*/
  public addWatcher(data)
  {
    const params = new HttpParams()
    .set('authToken',data.authToken)
    .set('watcherId',data.watcherId)
    .set('watcherName',data.watcherName)

    return this.http.put(`${this.baseUrl}/${data.issueId}/add/watcher`,params);
  }

 

}
