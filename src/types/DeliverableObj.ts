// src/types/interfaces.ts

export interface Person {
    name: string;
    id: string;
    email?: string;
}
  
export interface Approval {
    delegate: boolean;
    approve: boolean;
    reject: boolean;
    resubmit: boolean;
}
  
export interface ReviewProcess {
    approve: boolean;
    reject: boolean;
    resubmit: boolean;
}
  
export interface Company {
    name: string | null;
    id: string | null;
}
  
export interface DeliverableAuthor {
    name: string;
    id: string;
}
  
export interface DeliverableObj {
    SEO_Hashtags: string | null;
    SEO_External_Link_1: string | null;
    SEO_External_Link_2: string | null;
    Social_Number_of_Posts: number | null;
    Status_SEO: string | null;
    Admin_Approval: Person;
    Website_Content_Status: string | null;
    Sub_Category_Other: string | null;
    Article_Refresh_Status: string | null;
    id: string;
    Tool_Upload_Status: string | null;
    Event_Page_Status: string;
    Created_Time: string;
    Main_Status: string;
    Status_Website_Refresh: string | null;
    SEO_Keywords_Phrases: string | null;
    SEO_Internal_Link_1: string | null;
    Details: string | null;
    SEO_Internal_Link_2: string | null;
    Credit_Multiplier: number | null;
    YT_RI_RT_Status: string | null;
    Web_Designer: Person | null;
    rd_Party_Distribution: string | null;
    Handles_Mentioned: string | null;
    Content_Record_ID: string | null;
    Sub_Category_Graphics: string | null;
    Other_Distribution: any[];
    Short_Description: string | null;
    Type_Category_SEO: string | null;
    Single_Article_Status: string | null;
    GDocs_Content: string | null;
    Credit_Cost: number;
    Record_Status__s: string;
    Staff_SEO: string;
    Type_Category_Mass_Email: string | null;
    Locked__s: boolean;
    Tag: any[];
    Primary_Distribution: string | null;
    Sub_Category_Article: string | null;
    Quarter: string;
    Company: Company;
    Email: string | null;
    Graphic_Designer: Person;
    Topic_Category: string;
    Education_Level: string | null;
    Name: string;
    Last_Activity_Time: string;
    Quality_Control: Person;
    Status_Other: string | null;
    Unsubscribed_Mode: string | null;
    Priority: string;
    Main_Status1: string;
    Staff_Client_Contact: string;
    Sub_Category_Social: string | null;
    Graphic_Status: string | null;
    Staff_Manager: string;
    Sub_Category_Website: string;
    Status_Webinars: string | null;
    Block: string;
    Social_Target_URL: string | null;
    YT_Client_Video_Status: string | null;
    Sub_Category_YouTube1: string | null;
    Modified_By: Person;
    Social_Call_to_Action: string | null;
    Article_Refresh_5: string | null;
    Article_Refresh_6: string | null;
    Article_Refresh_3: string | null;
    Article_Refresh_4: string | null;
    Deliverable_Author: DeliverableAuthor;
    Article_Refresh_1: string | null;
    GDrive_Folder: string | null;
    Article_Refresh_2: string | null;
    Date_Published: string | null;
    Final_Deliverable: string | null;
    Stagnant_Timer: string;
    Modified_Time: string;
    Due_Date: string;
    Unsubscribed_Time: string | null;
    Social_Media_Status: string | null;
    Contact: string | null;
    $approval_state: string;
    Email_Status: string | null;
}
  