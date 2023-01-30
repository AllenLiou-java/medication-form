<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import type { FormInstance } from 'element-plus';
import { RouterView } from 'vue-router';
import router from '@/router';

const ruleForm = reactive({
  selectedDate: '',
  dosage: {
    onAm: null,
    onPm: null
  },
  bloodPressure: {
    am: [
      {
        name: '收縮壓',
        value: null,
        key: 'systolicAm'
      },
      {
        name: '舒張壓',
        value: null,
        key: 'diastolicAm'
      },
      {
        name: '心跳',
        value: null,
        key: 'heartbeatAm'
      }
    ],
    pm: [
      {
        name: '收縮壓',
        value: null,
        key: 'systolicPm'
      },
      {
        name: '舒張壓',
        value: null,
        key: 'diastolicPm'
      },
      {
        name: '心跳',
        value: null,
        key: 'heartbeatPm'
      }
    ]
  },
  skinInfo: {
    checkedLesions: [],
    lesions: ['麻', '痛', '腫脹', '皮疹', '搔癢', '掉毛'],
    others: null
  },
  digestiveSysInfo: {
    checkedLesions: [],
    lesions: ['腹瀉', '食慾不振', '噁心', '嘔吐'],
    others: null
  },
  othersInfo: {
    checkedLesions: [],
    lesions: ['疲勞', '出血', '發燒']
  },
  notesContent: null
});

onMounted(() => {
  // console.log(new Date().toLocaleDateString());
  const y = new Date().getFullYear();
  const m = new Date().getMonth();
  const d = new Date().getDate();

  const currentDate = new Date(y, m, d).toISOString();
  ruleForm.selectedDate = currentDate;

  getTargetGsheetData(currentDate);
});

const ruleFormRef = ref<FormInstance>();

// 資料驗證
// const validateDate = (rule: any, value: any, callback: any) => {
//   if (value === null) {
//     callback(new Error('請選取日期'));
//   } else {
//     callback();
//   }
// };

// const validateDosageOnAm = (rule: any, value: any, callback: any) => {
//   const dosage = ruleForm.dosage.onAm;
//   if (dosage === null) {
//     callback(new Error('請選取服用量'));
//   } else {
//     callback();
//   }
// };

// const validateDosageOnPm = (rule: any, value: any, callback: any) => {
//   const dosage = ruleForm.dosage.onPm;
//   if (dosage === null) {
//     callback(new Error('請選取服用量'));
//   } else {
//     callback();
//   }
// };

// const validateBloodPressure = (rule: any, value: any, callback: any) => {
//   const bloodPressureAmAttribute = ['systolicAm', 'diastolicAm', 'heartbeatAm'];
//   const bloodPressurePmAttribute = ['systolicPm', 'diastolicPm', 'heartbeatPm'];

//   const targetField = rule.field;
//   console.log(targetField);

//   let targetValue = null;
//   let targetFieldName = '';

//   const targetIndexAm = bloodPressureAmAttribute.indexOf(targetField);
//   const targetIndexPm = bloodPressurePmAttribute.indexOf(targetField);

//   if (targetIndexAm >= 0) {
//     targetValue = ruleForm.bloodPressure.am[targetIndexAm].value;
//     targetFieldName = ruleForm.bloodPressure.am[targetIndexAm].name;
//   } else if (targetIndexPm >= 0) {
//     targetValue = ruleForm.bloodPressure.pm[targetIndexPm].value;
//     targetFieldName = ruleForm.bloodPressure.pm[targetIndexPm].name;
//   }
//   console.log(targetValue);

//   if (targetValue === null || targetValue === '') {
//     callback(new Error(`請填入${targetFieldName}數值，ex: 60`));
//   } else {
//     callback();
//   }
// };

// const rules = reactive({
//   selectedDate: [{ validator: validateDate, trigger: 'change' }],
//   dosageOnAm: [{ validator: validateDosageOnAm, trigger: 'change' }],
//   dosageOnPm: [{ validator: validateDosageOnPm, trigger: 'change' }],
//   systolicAm: [{ validator: validateBloodPressure, trigger: 'change' }],
//   diastolicAm: [{ validator: validateBloodPressure, trigger: 'change' }],
//   heartbeatAm: [{ validator: validateBloodPressure, trigger: 'change' }],
//   systolicPm: [{ validator: validateBloodPressure, trigger: 'change' }],
//   diastolicPm: [{ validator: validateBloodPressure, trigger: 'change' }],
//   heartbeatPm: [{ validator: validateBloodPressure, trigger: 'change' }]
// });

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      console.log('submit!');
      updateGsheetData();
    } else {
      console.log('error submit!');
      return false;
    }
  });
};

const updateGsheetData = () => {
  const data = ruleForm;
  axios.post('api/gsheet/addData', data).then(() => {
    router.push({
      name: 'success'
    });
  });
};

const getTargetGsheetData = (targetDate: any) => {
  axios.get(`api/gsheet/getData?selectedDate=${targetDate}`).then(res => {
    const { dosage, bloodPressure, skinInfo, digestiveSysInfo, othersInfo, notesContent } =
      res.data;

    ruleForm.dosage = dosage;
    ruleForm.bloodPressure = bloodPressure;
    ruleForm.skinInfo = skinInfo;
    ruleForm.digestiveSysInfo = digestiveSysInfo;
    ruleForm.othersInfo = othersInfo;
    ruleForm.notesContent = notesContent;
  });
};

const options = Array.from({ length: 3 }).map((_, idx) => ({
  label: idx,
  value: idx
}));
</script>

<template>
  <RouterView />
  <h1 class="form_name">用藥紀錄表</h1>
  <el-form ref="ruleFormRef" :model="ruleForm">
    <el-form-item label="填寫日期" required>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-form-item prop="selectedDate">
          <el-date-picker
            v-model="ruleForm.selectedDate"
            type="date"
            label="請選取日期"
            placeholder="請選取日期"
            style="width: 100%"
            @change="getTargetGsheetData(ruleForm.selectedDate)"
          />
        </el-form-item>
      </el-col>
    </el-form-item>

    <el-row class="section">
      <el-col :lg="7">
        <el-form-item label="用藥量(早)" prop="dosageOnAm">
          <el-select-v2
            v-model="ruleForm.dosage.onAm"
            placeholder="請選擇服用數"
            :options="options"
          />
        </el-form-item>
      </el-col>
      <el-col :lg="7">
        <el-form-item label="用藥量(晚)" prop="dosageOnPm">
          <el-select-v2
            v-model="ruleForm.dosage.onPm"
            placeholder="請選擇服用數"
            :options="options"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <div class="section">
      <h3 class="group_name">血壓(早)</h3>
      <el-row :gutter="10">
        <el-col :span="8" v-for="item in ruleForm.bloodPressure.am" :key="item.name">
          <el-form-item :label="item.name" :prop="item.key">
            <el-input v-model="item.value" />
          </el-form-item>
        </el-col>
      </el-row>

      <h3 class="group_name">血壓(晚)</h3>
      <el-row :gutter="10">
        <el-col :span="8" v-for="item in ruleForm.bloodPressure.pm" :key="item.name">
          <el-form-item :label="item.name" :prop="item.key">
            <el-input v-model="item.value" />
          </el-form-item>
        </el-col>
      </el-row>
    </div>

    <div class="section">
      <el-form-item label="皮膚症狀">
        <el-row>
          <el-col :xs="24">
            <el-checkbox-group v-model="ruleForm.skinInfo.checkedLesions">
              <el-checkbox
                v-for="lesion in ruleForm.skinInfo.lesions"
                :key="lesion"
                :label="lesion"
                >{{ lesion }}</el-checkbox
              >
            </el-checkbox-group>
            <el-form-item label="其他">
              <el-input v-model="ruleForm.skinInfo.others" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="消化系統症狀">
        <el-row>
          <el-col :xs="24">
            <el-checkbox-group v-model="ruleForm.digestiveSysInfo.checkedLesions">
              <el-checkbox
                v-for="lesion in ruleForm.digestiveSysInfo.lesions"
                :key="lesion"
                :label="lesion"
                >{{ lesion }}</el-checkbox
              >
            </el-checkbox-group>
            <el-form-item label="其他">
              <el-input v-model="ruleForm.digestiveSysInfo.others" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="其他症狀">
        <el-row>
          <el-col :xs="24">
            <el-checkbox-group v-model="ruleForm.othersInfo.checkedLesions">
              <el-checkbox
                v-for="lesion in ruleForm.othersInfo.lesions"
                :key="lesion"
                :label="lesion"
                >{{ lesion }}</el-checkbox
              >
            </el-checkbox-group>
          </el-col>
        </el-row>
      </el-form-item>
    </div>

    <el-form-item label="備註">
      <el-input v-model="ruleForm.notesContent" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">資料送出</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.form_name {
  margin-bottom: 10px;
}
:deep(.group_name) {
  margin-bottom: 6px;
}
.section {
  background-color: #262727;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}

:deep(.el-form-item__label) {
  color: #f78989;
  font-weight: 600;
}

h3 {
  color: #ebb563;
  font-weight: 600;
}
</style>
