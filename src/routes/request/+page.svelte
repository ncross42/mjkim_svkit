<script>
  import { goto } from '$app/navigation';
  import preset from './preset.js';
  import options from './options.js';

  let budget = $state("300");
  let base_type = $state("1");
  let imageOptions = $state([]);
  let formData = $state({});

  let optionFields = ['width', 'height', 'frame_color', 'glass_color', 'devices', 'operation', 'thickness', 'handle', 'silence', 'daylight'];
  let optionValues = $state({});
  
  // 사용자가 수동으로 변경한 필드들을 추적
  let userModifiedFields = $state(new Set());

  // 초기화
  optionFields.forEach(key => {
    optionValues[key] = options[key] || [];
    formData[key] = optionValues[key][0]; // 기본값 첫 번째 값으로 초기화
  });

  // budget이 실제로 변경될 때만 실행 (더 간단한 방법)
  $effect.pre(() => {
    console.log('Budget changed to:', budget);
    updateImageOptions();
    // budget이 변경되면 userModifiedFields 초기화
    userModifiedFields.clear();
  });

  // budget 또는 base_type이 실제로 변경될 때만 실행
  $effect.pre(() => {
    // 이전 값을 추적하기 위한 static 변수 사용
    if (typeof updateOptionValues.prevBudget === 'undefined') {
      updateOptionValues.prevBudget = budget;
      updateOptionValues.prevBaseType = base_type;
    }
    if (budget !== updateOptionValues.prevBudget || base_type !== updateOptionValues.prevBaseType) {
      console.log('Updating option values for budget:', budget, 'base_type:', base_type);
      updateOptionValues();
      updateOptionValues.prevBudget = budget;
      updateOptionValues.prevBaseType = base_type;
    }
  });

  function updateImageOptions() {
    if (!budget) return;
    
    const presets = preset[budget] || [];
    const newImageOptions = presets.map((_, i) => ({
      value: `${i + 1}`,
      src: `/budget_imgs/${budget}_${i + 1}.png`
    }));
    
    // 배열 내용이 실제로 다를 때만 업데이트
    if (JSON.stringify(imageOptions) !== JSON.stringify(newImageOptions)) {
      imageOptions = newImageOptions;
      
      // 이미지 옵션이 있고 현재 base_type이 유효하지 않으면 첫 번째를 기본값으로 설정
      if (newImageOptions.length > 0) {
        const currentBaseType = base_type;  // 현재 값을 명시적으로 읽기
        if (currentBaseType !== newImageOptions[0].value) {
          base_type = newImageOptions[0].value;
        }
      }
    }
  }

  function updateOptionValues() {
    if (!budget || !base_type) return;
    
    const index = parseInt(base_type) - 1;
    const selected = preset[budget]?.[index];
    
    if (selected) {
      let hasChanges = false;
      const newFormData = { ...formData };
      
      optionFields.forEach(key => {
        optionValues[key] = options[key] || [];
        const newValue = selected[key] || optionValues[key][0];
        
        // 사용자가 수동으로 변경하지 않은 필드만 자동 업데이트
        if (!userModifiedFields.has(key) && newFormData[key] !== newValue) {
          newFormData[key] = newValue;
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        formData = newFormData;
      }
    }
  }

  // 사용자가 옵션을 수동으로 변경했을 때 호출되는 함수
  function handleOptionChange(field, value) {
    formData[field] = value;
    userModifiedFields.add(field);
  }

  // 특정 필드가 사용자에 의해 수정되었는지 확인하는 함수
  function isUserModified(field) {
    return userModifiedFields.has(field);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      params.append(key, value.toString());
    }

    // 수동으로 result로 이동
    await goto(`/result?${params.toString()}`);
  }

  // Reset 버튼 핸들러
  function handleReset() {
    // userModifiedFields 초기화
    userModifiedFields.clear();
    
    // 폼 데이터 초기화
    optionFields.forEach(key => {
      formData[key] = optionValues[key][0];
    });
    
    // budget과 base_type도 초기값으로 리셋
    budget = "300";
    base_type = "1";
  }

  // 초기 실행
  updateImageOptions();
  updateOptionValues();
</script>

<svelte:head>
	<title>Request Page</title>
	<meta name="description" content="Request Page" />
</svelte:head>

<div>
  <!-- Form Section -->
  <form onsubmit={handleSubmit} class="p-6 max-w-4xl mx-auto space-y-8 bg-gray-50 min-h-screen">
  <!-- <form method="POST" action="/generate" class="p-6 max-w-4xl mx-auto space-y-8 bg-gray-50 min-h-screen"> -->
    <div class="bg-white rounded-xl shadow-sm p-6 space-y-6">
    <!-- Budget radio -->
    <div class="space-y-3">
      <p class="font-bold text-gray-800">금액대 선택</p>
      <div class="flex gap-3">
        <label class="relative cursor-pointer">
          <input type="radio" name="budget" value="300" bind:group={budget} class="sr-only peer" />
          <div class="px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-200 hover:bg-gray-50 transition-all">
            <div class="flex items-center justify-center">
              <span class="font-medium text-gray-700 peer-checked:text-blue-700">300만원</span>
            </div>
          </div>
        </label>
        <label class="relative cursor-pointer">
          <input type="radio" name="budget" value="700" bind:group={budget} class="sr-only peer" />
          <div class="px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-200 hover:bg-gray-50 transition-all">
            <div class="flex items-center justify-center">
              <span class="font-medium text-gray-700 peer-checked:text-blue-700">700만원</span>
            </div>
          </div>
        </label>
      </div>
    </div>

    <!-- Image Selection -->
    {#if imageOptions.length > 0}
    <div class="space-y-3">
      <p class="font-bold text-gray-800">디자인 선택</p>
      <div class="grid grid-cols-3 gap-4">
        {#each imageOptions as img}
          <label class="relative cursor-pointer group">
            <input type="radio" name="base_type" value={img.value} bind:group={base_type} class="sr-only peer" />
            <div class="bg-white border-2 border-gray-200 rounded-xl p-3 peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-200 hover:border-gray-300 transition-all group-hover:shadow-md">
              <img src={img.src} alt="Option {img.value}" class="w-full h-32 object-cover rounded-lg mb-2" />
              <div class="text-center">
                <span class="text-sm font-medium text-gray-600 peer-checked:text-blue-600">옵션 {img.value}</span>
              </div>
            </div>
          </label>
        {/each}
      </div>
    </div>
    {/if}

    <!-- radioBoxes -->
    {#each optionFields as field}
      <div class="flex items-center gap-4">
        <div class="w-24 flex-shrink-0">
          <p class="font-bold text-gray-800 text-sm capitalize">{field.replace('_', ' ')}</p>
        </div>
        <div class="flex flex-wrap gap-2 flex-1">
          {#each optionValues[field] as val}
            <label class="relative cursor-pointer">
              <input 
                type="radio" 
                name={field} 
                value={val} 
                checked={formData[field] === val}
                onchange={() => handleOptionChange(field, val)}
                class="sr-only peer" 
              />
              <div class="px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-700 peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:text-blue-700 peer-checked:ring-1 peer-checked:ring-blue-200 hover:bg-gray-50 transition-all
                {formData[field] === val && isUserModified(field) ? 
                  '!bg-orange-50 !border-orange-500 !text-orange-700 !ring-1 !ring-orange-200' : ''
                }">
                {val}
              </div>
            </label>
          {/each}
        </div>
      </div>
    {/each}

    <!-- Buttons -->
    <div class="flex space-x-4 pt-4">
      <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Generate
      </button>
      <button type="button" onclick={handleReset} class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
        Reset
      </button>
    </div>
    </div>
  </form>
</div>