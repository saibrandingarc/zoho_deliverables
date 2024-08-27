<template>
    <v-row>
        <v-col cols="12" lg="12">
            <v-card>
                <v-card-item>
                    <v-table density="compact" class="border-thin">
                        <thead>
                            <tr>
                                <th class="text-center">Credits</th>
                                <th class="text-center">Q1</th>
                                <th class="text-center">Q2</th>
                                <th class="text-center">Q3</th>
                                <th class="text-center">Q4</th>
                                <th class="text-center">Used</th>
                                <th class="text-center">Total</th>
                                <th class="text-center">Available</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-left head">Approved</td>
                                <td class="text-left">{{ApprovedQuarter1}}</td>
                                <td class="text-left">{{ApprovedQuarter2}}</td>
                                <td class="text-left">{{ApprovedQuarter3}}</td>
                                <td class="text-left">{{ApprovedQuarter4}}</td>
                                <td class="text-left">{{UsedApproved}}</td>
                                <td class="text-left">{{TotalApproved}}</td>
                                <td class="text-left">{{AvailableApproved}}</td>
                            </tr>
                            <tr>
                                <td class="text-left head">Planned</td>
                                <td class="text-left">{{PlannedQuarter1}}</td>
                                <td class="text-left">{{PlannedQuarter2}}</td>
                                <td class="text-left">{{PlannedQuarter3}}</td>
                                <td class="text-left">{{PlannedQuarter4}}</td>
                                <td class="text-left">{{UsedPlanned}}</td>
                                <td class="text-left">{{TotalPlanned}}</td>
                                <td class="text-left">{{AvailablePlanned}}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card-item>
            </v-card>
        </v-col>
        <v-col cols="12" lg="12">
            
            <v-card class="mx-auto">
                <header class="v-toolbar v-toolbar--flat v-toolbar--density-default border-b v-theme--light v-locale--is-ltr px-1">
                    <div class="v-toolbar__content" style="height: 44px;">
                        <v-row>
                            <v-col cols="4">
                                <h5>Select Company</h5>
                            </v-col>
                            <v-col cols="4" class="text-center">
                                <v-btn class="mx-3 fs-6 fw-bold" btn color="primary" dark v-on:click="updateData">Update</v-btn>
                                <v-btn class="mx-3 fs-6 fw-bold" btn color="primary" dark v-on:click="refreshData">Refresh</v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </header>
                <v-card-item class="pt-0">
                    <div class="d-sm-flex align-center justify-space-between pt-sm-2 pb-0">
                        <select2 :data="accounts"
                            :value="value"
                            @update="onAccountChange">
                        </select2>
                    </div>
                    <div class="mt-6 pt-0">
                        <HotTable
                            :data="tableData"
                            :colHeaders="colHeaders"
                            :columns="columnsConfig"
                            :settings="hotSettings"
                            :licenseKey="'non-commercial-and-evaluation'"
                            :key="tableKey"
                            ref="hotTableRef"
                            @afterChange="handleCellChange"
                        />
                        <!-- <hot-table :settings="handsontableSettings" :key="tableKey" :fixed-columns-start="5"></hot-table> -->
                    </div>
                </v-card-item>
            </v-card>
        </v-col>
        
    </v-row>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Select2 } from "select2-vue-component";
import { defineComponent } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import axios from 'axios';
import { getZohoToken, clearExpiredZohoToken } from '@/utils/tokenManager'; // Import utility functions
import "select2-component/dist/select2.css";
import type { DeliverableObj, Company, Person } from '../../types/DeliverableObj';

registerAllModules();
interface TransformedAccount {
    label: string;
    value: string;
}

interface PickListValue {
    id: string;
    displayValue: string;
    actualValue: string;
}

interface SelectedField {
    id: string;
    fieldLabel: string;
    apiName: string;
    pickListValues: PickListValue[];
}

const selectedFieldsArray = ref<SelectedField[]>([]);
    
const defaultDataObj = [
    { "label": "Topic", "default_value": "", "dataList": [] },
    { "label": "Topic Category", "default_value": "", "dataList": [] },
    { "label": "Record Status", "default_value": "", "dataList": [] },
    { "label": "Main Status", "default_value": "", "dataList": [] },
    { "label": "Staff - Admin Approval", "default_value": "Adam Parks", "dataList": [] },
    { "label": "Staff - Deliverable Author", "default_value": "Jager Robinson", "dataList": [] },
    { "label": "Staff - Quality Control", "default_value": "Adam Parks", "dataList": [] },
    { "label": "Staff - Graphic Designer", "default_value": "Jekesh Mistry", "dataList": [] },
    { "label": "Staff - Manager", "default_value": "Adam Parks", "dataList": [] },
    { "label": "Staff - Web Designer", "default_value": "Aditya Kadam", "dataList": [] },
    { "label": "Staff - Client Contact", "default_value": "katalina Dawson", "dataList": [] },
    { "label": "Staff - SEO", "default_value": "Adam Parks", "dataList": [] }
];

const token = getZohoToken();
console.log("tkn : "+token);

const hotTableRef = ref<any>(null);
const ObjectUpload = ref<DeliverableObj | null>(null);

const ApprovedQuarter1 = ref(0);
const ApprovedQuarter2 = ref(0);
const ApprovedQuarter3 = ref(0);
const ApprovedQuarter4 = ref(0);
const PlannedQuarter1 = ref(0);
const PlannedQuarter2 = ref(0);
const PlannedQuarter3 = ref(0);
const PlannedQuarter4 = ref(0);
const UsedApproved = ref(0);
const UsedPlanned = ref(0);
const TotalApproved = ref(0);
const TotalPlanned = ref(0);
const AvailableApproved = ref(0);
const AvailablePlanned = ref(0);

const tableData = ref<any[]>([]);
const accounts = ref<any[]>([]);
const mainmenu = ref<any[]>([]);
const staff = ref<any[]>([]);
const defaultData = ref<any[]>([]);
const selectedAccountId = ref<string | null>(null);
const selectedAccountName = ref<string | null>(null);

ObjectUpload.value = {
    SEO_Hashtags: null,
    SEO_External_Link_1: null,
    SEO_External_Link_2: null,
    Social_Number_of_Posts: null,
    Status_SEO: null,
    Admin_Approval: { name: '', id: '' },
    Website_Content_Status: null,
    Sub_Category_Other: null,
    Article_Refresh_Status: null,
    id: '',
    Tool_Upload_Status: null,
    Event_Page_Status: '',
    Created_Time: '',
    Main_Status: '',
    Status_Website_Refresh: null,
    SEO_Keywords_Phrases: null,
    SEO_Internal_Link_1: null,
    Details: null,
    SEO_Internal_Link_2: null,
    Credit_Multiplier: null,
    YT_RI_RT_Status: null,
    Web_Designer: { name: '', id: '' },
    rd_Party_Distribution: null,
    Handles_Mentioned: null,
    Content_Record_ID: null,
    Sub_Category_Graphics: null,
    Other_Distribution: [],
    Short_Description: null,
    Type_Category_SEO: null,
    Single_Article_Status: null,
    GDocs_Content: null,
    Credit_Cost: 0,
    Record_Status__s: '',
    Staff_SEO: '',
    Type_Category_Mass_Email: null,
    Locked__s: false,
    Tag: [],
    Primary_Distribution: null,
    Sub_Category_Article: null,
    Quarter: '',
    Company: { name: '', id: '' },
    Email: null,
    Graphic_Designer: { name: '', id: '' },
    Topic_Category: '',
    Education_Level: null,
    Name: '',
    Last_Activity_Time: '',
    Quality_Control: { name: '', id: '' },
    Status_Other: null,
    Unsubscribed_Mode: null,
    Priority: '',
    Main_Status1: '',
    Staff_Client_Contact: '',
    Sub_Category_Social: null,
    Graphic_Status: null,
    Staff_Manager: '',
    Sub_Category_Website: '',
    Status_Webinars: null,
    Block: '',
    Social_Target_URL: null,
    YT_Client_Video_Status: null,
    Sub_Category_YouTube1: null,
    Modified_By: { name: '', id: '', email: '' },
    Social_Call_to_Action: null,
    Article_Refresh_5: null,
    Article_Refresh_6: null,
    Article_Refresh_3: null,
    Article_Refresh_4: null,
    Deliverable_Author: { name: '', id: '' },
    Article_Refresh_1: null,
    GDrive_Folder: null,
    Article_Refresh_2: null,
    Date_Published: null,
    Final_Deliverable: null,
    Stagnant_Timer: '',
    Modified_Time: '',
    Due_Date: '',
    Unsubscribed_Time: null,
    Social_Media_Status: null,
    Contact: null,
    $approval_state: '',
    Email_Status: null
};


const hotSettings = ref({
    fixedColumnsStart: 6,
    width: '100%',
    height: '500px',
    stretchH: 'all',
    dropdownMenu: false,
    rowHeaders: true,
    contextMenu: true,
    licenseKey: 'non-commercial-and-evaluation',
    hiddenColumns: {
        columns: [0, 9], 
        indicators: false  // Optional: if true, shows indicators where columns are hidden
    },
    afterDocumentKeyDown(event: KeyboardEvent) {
        const hotInstance = hotTableRef.value?.hotInstance;
        if (hotInstance && event.key === 'Enter') {
            const lastRowIndex = hotInstance.countRows() - 1;
            const lastColIndex = hotInstance.countCols() - 1;
            const selected = hotInstance.getSelectedLast();

            if (selected) {
                const [row, col] = selected;
                // if (row === lastRowIndex && col === lastColIndex) {
                if (row === lastRowIndex) {
                    hotInstance.alter('insert_row_above', row + 1);
                    const newRow = row+1;
                    hotInstance.setDataAtCell(newRow, 1, "In Progress");
                    hotInstance.setDataAtCell(newRow, 2, hotInstance.getDataAtCell(row, 2));
                    hotInstance.setDataAtCell(newRow, 3, hotInstance.getDataAtCell(row, 3));
                    hotInstance.setDataAtCell(newRow, 11, hotInstance.getDataAtCell(row, 11));
                    hotInstance.setDataAtCell(newRow, 16, defaultDataObj.filter(item => item.label == 'Staff - Manager')[0].default_value);
                    hotInstance.setDataAtCell(newRow, 17, defaultDataObj.filter(item => item.label == 'Staff - SEO')[0].default_value);
                    hotInstance.setDataAtCell(newRow, 18, defaultDataObj.filter(item => item.label == 'Staff - Client Contact')[0].default_value);
                    hotInstance.setDataAtCell(newRow, 19, defaultDataObj.filter(item => item.label == 'Staff - Admin Approval')[0].default_value);
                    hotInstance.setDataAtCell(newRow, 20, defaultDataObj.filter(item => item.label == 'Staff - Deliverable Author')[0].default_value);
                    hotInstance.setDataAtCell(newRow, 21, defaultDataObj.filter(item => item.label == 'Staff - Quality Control')[0].default_value);
                    hotInstance.setDataAtCell(newRow, 22, defaultDataObj.filter(item => item.label == 'Staff - Graphic Designer')[0].default_value);
                    hotInstance.setDataAtCell(newRow, 23, defaultDataObj.filter(item => item.label == 'Staff - Web Designer')[0].default_value);
                    // Example usage
                    const block = hotInstance.getDataAtCell(newRow, 3);
                    const lastDate = getLastDateOfMonth(block);
                    hotInstance.setDataAtCell(newRow, 15, lastDate);
                }
            }
        }
    },
    afterChange(changes: any, source: string) {
        const hotInstance = hotTableRef.value?.hotInstance;
        if (source === 'edit' && changes) {
            changes.forEach(([row, col, oldValue, newValue]: any) => {
                if(col == 4) {
                    const selectedObject = mainmenu.value.find(obj => obj.project === newValue) || null;
                    console.log(selectedObject);
                    hotInstance.setDataAtCell(row, 6, selectedObject.description);
                    hotInstance.setDataAtCell(row, 7, selectedObject.mainContentType);
                    hotInstance.setDataAtCell(row, 8, selectedObject.credits);
                    hotInstance.setDataAtCell(row, 10, selectedObject.credits);
                    hotInstance.setDataAtCell(row, 12, selectedObject.mainContentType);
                    // Example usage
                    const block = hotInstance.getDataAtCell(row, 3);
                    const lastDate = getLastDateOfMonth(block);
                    hotInstance.setDataAtCell(row, 15, lastDate);
                    console.log(lastDate);
                }
            });
        }
    }
});

let mainmenu1: any[] = [];
const usersListObj = ref<any[]>([]);
let usersList: never[]|undefined = [];

function generateDateArray(start: Date, end: Date): string[] {
  const dates: string[] = [];
  let currentDate = new Date(start);

  while (currentDate <= end) {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    dates.push(`${year}-${month}`);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return dates;
}

const currentDate = new Date();
const startDate = new Date(currentDate.getFullYear() - 1, 0, 1);
const endDate = new Date(currentDate.getFullYear() + 1, 11, 31);
const dateArray = ref(generateDateArray(startDate, endDate));

const colHeaders = ref([
    'Id', 'Status', 'Quarter', 'Block', 'Project', 'Topic', 'Basic Description', 'Category',
    'Base Credits', 'Multiplier', 'Credit Total', 'Company', 'Topic Category', 'Contact', 
    'Priority', 'Due Date', 'Staff - Manager', 'Staff - SEO', 'Staff - Client Contact',
    'Staff - Admin Approval', 'Staff - Deliverable Author', 'Staff - Quality Control', 
    'Staff - Graphic Designer', 'Staff - Web Designer', 'Distribution - Primary',
    '3rd Party Distribution?', 'Details - Short'
]);

const columnsConfig = ref([
        { data: 0 }, { data: 1 }, { data: 2 }, { data: 3 }, { data: 4 }, { data: 5 }, { data: 6 },
        { data: 7 }, { data: 8 }, { data: 9 }, { data: 10 }, { data: 11 }, { data: 12 },
        { data: 13 }, { data: 14 }, { data: 15 }, { data: 16 }, { data: 17 }, { data: 18 },
        { data: 19 }, { data: 20 }, { data: 21 }, { data: 22 }, { data: 23 }, { data: 24 },
        { data: 25 }, { data: 26 }
    ]);

const totalPageCount = ref<number>(1);

const fetchPageData = async (page: number) => {
    try {
        const response = await axios.get(`https://www.zohoapis.com/crm/v7/Accounts?fields=Account_Name&page=${page}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data.data; // Adjust this based on the actual API response structure
    } catch (error) {
        console.error(`Error fetching data for page ${page}:`, error);
        return []; // Return an empty array on error
    }
};

const fetchTotalPageCount = async () => {
    try {
        const response = await axios.get('https://www.zohoapis.com/crm/v7/Accounts/actions/count', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const itemsPerPage = 200;
        totalPageCount.value = Math.ceil(response.data.count / itemsPerPage);
    } catch (error) {
        console.error('Error fetching total page count:', error);
    }
};

const fetchAllPages = async () => {
    await fetchTotalPageCount();
    accounts.value = [];

    const fetchPagePromises = [];
    for (let page = 1; page <= totalPageCount.value; page++) {
        fetchPagePromises.push(fetchPageData(page));
    }

    try {
        const pageDataResults = await Promise.all(fetchPagePromises);
        const transformedAccounts: TransformedAccount[] = pageDataResults.flat().map(account => ({
            label: account.Account_Name,
            value: account.id
        }));
        accounts.value = transformedAccounts.flat().sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
    } catch (error) {
        console.error('Error fetching data from pages:', error);
    }
};

const fetchGenericData = async () => {
    try {
        const response = await axios.get("https://www.zohoapis.com/crm/v7/users?type=AllUsers", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const transformedAccounts: TransformedAccount[] = response.data.users.flat().map(account => ({
            label: account.full_name,
            value: account.id
        }));
        usersListObj.value = transformedAccounts.flat().sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
        usersList = response.data.users.map(item => item.full_name);
        axios.get("https://localhost:7222/meta/Generic/GetMainMenu")
        .then(response => {
            mainmenu.value = response.data;
            mainmenu1 = response.data.map((item) => item.project);

            axios.get("https://www.zohoapis.com/crm/v7/settings/fields?module=Deliverables", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(response => {
                let apiResponse = response.data.fields;
                let selectedFieldsArray1 = apiResponse.map(item => {
                    if (item.field_label) {
                        return [
                            item.field_label,
                            {
                                id: item.id,
                                dataType: item.data_type,
                                pickListValues: item.pick_list_values || []
                            }
                        ] as [string, { id: string; dataType: string; pickListValues: PickListValue[] }];
                    }
                });
                const validLabels = defaultDataObj.map(item => item.label)
                const filteredData = ref(selectedFieldsArray1.filter(item => validLabels.includes(item[0])));
                filteredData.value.reduce(async (groups, staff) => {
                    let key = staff[0];
                    let obj = staff[1];
                    if(obj.dataType == "userlookup") {
                        defaultDataObj.filter(item => item.label == key)[0].dataList = usersList;
                    } else {
                        if(obj.dataType == "picklist") {
                            let tempArray = obj.pickListValues.map(item => item.display_value);
                            defaultDataObj.filter(item => item.label == key)[0].dataList = tempArray;
                        }
                    }
                }, {});
                columnsConfig.value = [
                    { data: 0 },
                    { 
                        data: 1, 
                        type: 'dropdown', 
                        source: ['In Progress', 'Completed', 'Pending'],
                        default: 0,
                        strict: true,
                    },
                    { data: 2 },
                    {
                        data: 3, 
                        type: 'dropdown', 
                        source: dateArray.value,
                        width: 100
                    },
                    {
                        data: 4, 
                        type: 'dropdown', 
                        source: mainmenu1,
                        width: 150
                    },
                    { data: 5, width: 300, wordWrap: false },
                    { data: 6, width: 300, wordWrap: true },
                    { data: 7 },
                    { data: 8 },
                    { data: 9 },
                    { data: 10 },
                    { data: 11 },
                    { data: 12 },
                    { data: 13 },
                    { data: 14 },
                    { data: 15 },
                    { 
                        data: 16,
                        type: 'dropdown',
                        source: defaultDataObj.filter(item => item.label == 'Staff - Manager')[0].dataList,
                        width: 150,
                        default: defaultDataObj.filter(item => item.label == 'Staff - Manager')[0].default_value
                    },
                    { 
                        data: 17,
                        type: 'dropdown',
                        source: defaultDataObj.filter(item => item.label == 'Staff - SEO')[0].dataList,
                        width: 150,
                        default: defaultDataObj.filter(item => item.label == 'Staff - SEO')[0].default_value
                    },
                    { 
                        data: 18,
                        type: 'dropdown',
                        source: defaultDataObj.filter(item => item.label == 'Staff - Client Contact')[0].dataList,
                        width: 150,
                        default: defaultDataObj.filter(item => item.label == 'Staff - Client Contact')[0].default_value
                    },
                    { 
                        data: 19,
                        type: 'dropdown',
                        source: defaultDataObj.filter(item => item.label == 'Staff - Admin Approval')[0].dataList,
                        width: 150,
                        default: defaultDataObj.filter(item => item.label == 'Staff - Admin Approval')[0].default_value
                    },
                    { 
                        data: 20,
                        type: 'dropdown',
                        source: defaultDataObj.filter(item => item.label == 'Staff - Deliverable Author')[0].dataList,
                        width: 150,
                        default: defaultDataObj.filter(item => item.label == 'Staff - Deliverable Author')[0].default_value
                    },
                    { 
                        data: 21,
                        type: 'dropdown',
                        source: defaultDataObj.filter(item => item.label == 'Staff - Quality Control')[0].dataList,
                        width: 150,
                        default: defaultDataObj.filter(item => item.label == 'Staff - Quality Control')[0].default_value
                    },
                    { 
                        data: 22,
                        type: 'dropdown',
                        source: defaultDataObj.filter(item => item.label == 'Staff - Graphic Designer')[0].dataList,
                        width: 150,
                        default: defaultDataObj.filter(item => item.label == 'Staff - Graphic Designer')[0].default_value
                    },
                    { 
                        data: 23,
                        type: 'dropdown',
                        source: defaultDataObj.filter(item => item.label == 'Staff - Web Designer')[0].dataList,
                        width: 150,
                        default: defaultDataObj.filter(item => item.label == 'Staff - Web Designer')[0].default_value
                    },
                    { data: 24 },
                    { data: 25 },
                    { data: 26 }
                ];
                console.log(columnsConfig);
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    } catch (error) {
        console.error('Error fetching data from pages:', error);
    }
};

onMounted(() => {
    fetchGenericData();
    fetchAllPages();
    const hotInstance = hotTableRef.value?.hotInstance;
    if (hotInstance) {
        hotInstance.render();
    }
});

const topicCategory = ref([
    { "label": "Ads", "mapAttr": "Main_Status" },
    { "label": "Article", "mapAttr": "Sub_Category_Article" },
    { "label": "Graphics", "mapAttr": "Sub_Category_Graphics" },
    { "label": "Mass Email", "mapAttr": "Type_Category_Mass_Email" },
    { "label": "SEO", "mapAttr": "Type_Category_SEO" },
    { "label": "Social", "mapAttr": "Sub_Category_Social" },
    { "label": "Website", "mapAttr": "Sub_Category_Website" },
    { "label": "Video", "mapAttr": "Sub_Category_YouTube1" },
    { "label": "Other", "mapAttr": "Sub_Category_Other" }
]);

const data = ref<any[]>([]);

const tableKey = ref(0);

const onAccountChange = (newValue: string | null) => {
    if(newValue != null) {
        selectedAccountId.value = newValue;
        selectedAccountName.value = accounts.value.find(account => account.value === newValue).label;
        localStorage.setItem("SelectedAccount", newValue?? '');

        console.log('Selected Account ID:', newValue);
        getDeliverablesInfoFromZoho(newValue);
    }
};

const refreshData = async () => {
    let selectedAccount = localStorage.getItem("SelectedAccount");
    getDeliverablesInfoFromZoho(selectedAccount);
};

function getDeliverablesInfoFromZoho(newValue: string|null) {
    axios.get("https://www.zohoapis.com/crm/v7/Deliverables/search?criteria=(Company.id:equals:"+newValue+")", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    .then(response => {
        data.value = response.data.data;
            const transformedData = response.data.data.map((item: any) => {
                let multiplier = item.Credit_Multiplier === "None" ? 1 : parseFloat(item.Credit_Multiplier) || 0;
                let credit_cost = parseFloat(item.Credit_Cost) || 0;

                switch (item.Quarter) {
                    case "1":
                        if(item.$approval_state == "approved" || item.$approval_state == "uploaded") {
                            ApprovedQuarter1.value += credit_cost * multiplier;
                        } else {
                            PlannedQuarter1.value += credit_cost * multiplier;
                        }
                        break;
                    case "2":
                        if(item.$approval_state == "approved" || item.$approval_state == "uploaded") {
                            ApprovedQuarter2.value += credit_cost * multiplier;
                        } else {
                            PlannedQuarter2.value += credit_cost * multiplier;    
                        }
                        break;
                    case "3":
                        if(item.$approval_state == "approved" || item.$approval_state == "uploaded") {
                            ApprovedQuarter3.value += credit_cost * multiplier;
                        } else {
                            PlannedQuarter3.value += credit_cost * multiplier;
                        }
                        break;
                    case "4":
                        if(item.$approval_state == "approved" || item.$approval_state == "uploaded") {
                            ApprovedQuarter4.value += credit_cost * multiplier;
                        } else {
                            PlannedQuarter4.value += credit_cost * multiplier;
                        }
                        break;
                    default:
                        console.log("Invalid quarter:", item.Quarter);
                }
                let mainStatus = item.Main_Status;
                const result = topicCategory.value.find(topic => topic.label === mainStatus);
                let description = item[result?.mapAttr as keyof typeof item] || null;
                const menuObj = mainmenu.value.find(menu => 
                    menu.mainContentType === mainStatus && menu.project === description
                );
                let menuDescription = "";
                if(menuObj) {
                    menuDescription = menuObj.description ?? '';
                } else {
                    menuDescription = "";
                }
                // console.log(item.Staff_Manager == null ? (groupedStaff['Staff - Manager']?.defaultValue || '') : item.Staff_Manager);
                return [
                    item.id,
                    item.Tool_Upload_Status,
                    item.Quarter ?? '',
                    item.Block ?? '',
                    description,
                    item.Name ?? '',
                    menuDescription,
                    item.Topic_Category,
                    item.Credit_Cost,
                    item.Credit_Multiplier,
                    (credit_cost*multiplier),
                    item.Company.name,
                    item.Main_Status,
                    item.Email,
                    item.Priority,
                    item.Due_Date,  
                    item.Staff_Manager == null ? defaultDataObj.filter(item => item.label == 'Staff - Manager')[0].default_value : item.Staff_Manager,
                    item.Staff_SEO == null ? defaultDataObj.filter(item => item.label == 'Staff - SEO')[0].default_value : item.Staff_SEO,
                    item.Staff_Client_Contact == null ? defaultDataObj.filter(item => item.label == 'Staff - Client Contact')[0].default_value : item.Staff_Client_Contact,
                    item.Admin_Approval == null ? defaultDataObj.filter(item => item.label == 'Staff - Admin Approval')[0].default_value : (item.Admin_Approval.name ?? ''),
                    item.Deliverable_Author == null ? defaultDataObj.filter(item => item.label == 'Staff - Deliverable Author')[0].default_value : (item.Deliverable_Author.name ?? ''),
                    item.Quality_Control == null ? defaultDataObj.filter(item => item.label == 'Staff - Quality Control')[0].default_value : (item.Quality_Control.name ?? ''),
                    item.Graphic_Designer == null ? defaultDataObj.filter(item => item.label == 'Staff - Graphic Designer')[0].default_value : (item.Graphic_Designer.name ?? ''),
                    item.Web_designer == null ? defaultDataObj.filter(item => item.label == 'Staff - Web Designer')[0].default_value : (item.Web_designer.name ?? ''),
                    '',
                    '',
                    ''
                ];
            });
            tableData.value = transformedData;
            // // Update Handsontable settings with new data
            // tableData.value = {
            // ...handsontableSettings.value,
            // data: transformedData
            // };

            // Update key to force re-render
            tableKey.value += 1;
            TotalApproved.value = ApprovedQuarter1.value+ApprovedQuarter2.value+ApprovedQuarter3.value+ApprovedQuarter4.value;
            TotalPlanned.value = PlannedQuarter1.value+PlannedQuarter2.value+PlannedQuarter3.value+PlannedQuarter4.value;

            UsedApproved.value = ApprovedQuarter1.value+ApprovedQuarter2.value+ApprovedQuarter3.value+ApprovedQuarter4.value;
            UsedPlanned.value = PlannedQuarter1.value+PlannedQuarter2.value+PlannedQuarter3.value+PlannedQuarter4.value;

            AvailableApproved.value = TotalApproved.value-UsedApproved.value;
            AvailablePlanned.value = TotalApproved.value-UsedApproved.value;
            // hot.render();
    })
    .catch(error => {
        console.error(error);
    });
}

const checkIdExistence = (idToCheck: string): boolean => {
    return jsonObject2.value.some((item) => item.id === idToCheck);
};

const updateData = () => {
    console.log(data.value);
    if (hotTableRef.value) {
        const hotInstance = hotTableRef.value.hotInstance;
        if (hotInstance) {
            const table_data = hotInstance.getData(); // Get raw data
            const headers = colHeaders.value;

            const jsonData = table_data.map((row: any[]) => {
                return headers.reduce((acc: any, header: string, index: number) => {
                acc[header] = row[index];
                return acc;
                }, {});
            });

            console.log('Table Data as JSON:', jsonData);
            const validIds = ref(jsonData.filter(item => item.Id !== null));
            const nullIds = ref(jsonData.filter(item => item.Id === null));

            validIds.value.forEach(async item => {
                const response = await axios.get('https://www.zohoapis.com/crm/v7/Deliverables/'+item.Id, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                ObjectUpload.value = response.data.data[0];
                console.log(ObjectUpload.value);

                // const companyInfo: Company = {
                //     name: selectedAccountName.value,
                //     id: selectedAccountId.value
                // };



                let admin_approval = usersListObj.value.find(account => account.label === item['Staff - Admin Approval'])
                const admin_approval_info: Person = {
                    name: admin_approval.label,
                    id: admin_approval.value
                };

                let quality_control = usersListObj.value.find(account => account.label === item['Staff - Quality Control'])
                const quality_control_info: Person = {
                    name: quality_control.label,
                    id: quality_control.value
                };

                let deliverable_author = usersListObj.value.find(account => account.label === item['Staff - Deliverable Author'])
                const deliverable_author_info: Person = {
                    name: deliverable_author.label,
                    id: deliverable_author.value
                };

                let graphics_designer = usersListObj.value.find(account => account.label === item['Staff - Graphic Designer'])
                const graphics_designer_info: Person = {
                    name: graphics_designer.label,
                    id: graphics_designer.value
                };

                let web_designer = usersListObj.value.find(account => account.label === item['Staff - Web Designer']);
                const web_designer_info: Person = {
                    name: web_designer.label,
                    id: web_designer.value
                };
                
                if (ObjectUpload.value) {
                    ObjectUpload.value.id = item['id'];
                    ObjectUpload.value.Tool_Upload_Status = item['Status'];
                    ObjectUpload.value.Quarter = item['Quarter'];
                    ObjectUpload.value.Block = item['Block'];
                    ObjectUpload.value.Topic_Category = item['Category'];
                    if(item['Category'] == "Website") {
                        ObjectUpload.value.Sub_Category_Website = item['Project'];
                    }
                    ObjectUpload.value.Name = item['Topic'];
                    ObjectUpload.value.Credit_Cost = item['Base Credits'];
                    ObjectUpload.value.Priority = item['Priority'];
                    ObjectUpload.value.Due_Date = item['Due Date'];
                    ObjectUpload.value.Staff_Manager = item['Staff - Manager'];
                    ObjectUpload.value.Admin_Approval = admin_approval_info;
                    ObjectUpload.value.Quality_Control = quality_control_info;
                    ObjectUpload.value.Deliverable_Author = deliverable_author_info;
                    ObjectUpload.value.Graphic_Designer = graphics_designer_info;
                    ObjectUpload.value.Web_Designer = web_designer_info;
                    ObjectUpload.value.Staff_SEO = item['Staff - SEO'];
                    ObjectUpload.value.Primary_Distribution = item['Distribution - Primary'];
                    ObjectUpload.value.Details = item['Details - Short'];
                    ObjectUpload.value.Short_Description = item['Basic Description'];
                    
                }
                console.log(ObjectUpload.value);
                const items: Array<DeliverableObj | null> = [];

                items.push(ObjectUpload.value);
                const data = {
                    "data": items
                }
                const stat = await axios.put('https://www.zohoapis.com/crm/v7/Deliverables/'+item.Id, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }).catch((error) => {
                    console.log(error);
                });
                console.log(stat)
            });

            nullIds.value.forEach(async item => {
                
                const companyInfo: Company = {
                    name: selectedAccountName.value,
                    id: selectedAccountId.value
                };

                let admin_approval = usersListObj.value.find(account => account.label === item['Staff - Admin Approval'])
                const admin_approval_info: Person = {
                    name: admin_approval.label,
                    id: admin_approval.value
                };

                let quality_control = usersListObj.value.find(account => account.label === item['Staff - Quality Control'])
                const quality_control_info: Person = {
                    name: quality_control.label,
                    id: quality_control.value
                };

                let deliverable_author = usersListObj.value.find(account => account.label === item['Staff - Deliverable Author'])
                const deliverable_author_info: Person = {
                    name: deliverable_author.label,
                    id: deliverable_author.value
                };

                let graphics_designer = usersListObj.value.find(account => account.label === item['Staff - Graphic Designer'])
                const graphics_designer_info: Person = {
                    name: graphics_designer.label,
                    id: graphics_designer.value
                };

                let web_designer = usersListObj.value.find(account => account.label === item['Staff - Web Designer']);
                const web_designer_info: Person = {
                    name: web_designer.label,
                    id: web_designer.value
                };
                
                if (ObjectUpload.value) {
                    ObjectUpload.value.id = item['id'];
                    ObjectUpload.value.Tool_Upload_Status = item['Status'];
                    ObjectUpload.value.Quarter = item['Quarter'];
                    ObjectUpload.value.Block = item['Block'];
                    ObjectUpload.value.Topic_Category = item['Category'];
                    if(item['Category'] == "Website") {
                        ObjectUpload.value.Sub_Category_Website = item['Project'];
                    }
                    ObjectUpload.value.Name = item['Topic'];
                    ObjectUpload.value.Credit_Cost = item['Base Credits'];
                    ObjectUpload.value.Priority = item['Priority'];
                    ObjectUpload.value.Due_Date = item['Due Date'];
                    ObjectUpload.value.Staff_Manager = item['Staff - Manager'];
                    ObjectUpload.value.Admin_Approval = admin_approval_info;
                    ObjectUpload.value.Quality_Control = quality_control_info;
                    ObjectUpload.value.Deliverable_Author = deliverable_author_info;
                    ObjectUpload.value.Graphic_Designer = graphics_designer_info;
                    ObjectUpload.value.Web_Designer = web_designer_info;
                    ObjectUpload.value.Staff_SEO = item['Staff - SEO'];
                    ObjectUpload.value.Primary_Distribution = item['Distribution - Primary'];
                    ObjectUpload.value.Details = item['Details - Short'];
                    ObjectUpload.value.Short_Description = item['Basic Description'];
                    ObjectUpload.value.Company = companyInfo;
                    ObjectUpload.value.Modified_By = admin_approval_info;
                    
                }
                console.log(ObjectUpload.value);
                const items: Array<DeliverableObj | null> = [];

                items.push(ObjectUpload.value);
                const data = {
                    "data": items
                }

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://www.zohoapis.com/crm/v7/Deliverables',
                    headers: { 
                        'Authorization': `Bearer ${token}`, 
                    },
                    data : JSON.stringify({
                                        "data": [
                                            ObjectUpload.value
                                        ]
                                    })
                };

                axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                    console.log(error);
                });

                // const stat = await axios.post('https://www.zohoapis.com/crm/v7/Deliverables', data, {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     }
                // }).catch((error) => {
                //     console.log(error);
                // });
                // console.log(stat)
            });
        }
    }
};

function getLastDateOfMonth(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number);

  // Create a date object for the first day of the next month
  const firstDayNextMonth = new Date(year, month, 1);

  // Subtract 1 day to get the last day of the given month
  const lastDate = new Date(firstDayNextMonth.getTime() - 1);

  // Format the date as YYYY-MM-DD
  const lastDateString = lastDate.toISOString().split('T')[0];

  return lastDateString;
}

</script>
<style>
table {
    caption-side: bottom;
    border-collapse: collapse;
    border: 1px solid black;
}

tr, td {
    border: 2px solid black;
}

th {
    border: 2px solid black;
    font-size:medium;
    background-color:azure;
    font-weight: bold;
}

.head {
    background-color:azure;
    font-size:medium;
    font-weight: bold;
}
</style>