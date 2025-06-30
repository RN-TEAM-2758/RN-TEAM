repeat task.wait() until game:IsLoaded()
wait(1)

-- Services
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer
local Lighting = game:GetService("Lighting")
local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")

-- UI Setup
local guiReady, PlayerGui = pcall(function()
    return LocalPlayer:WaitForChild("PlayerGui", 5)
end)

if not guiReady or not PlayerGui then
    warn("PlayerGui not loaded.")
    return
end

-- Main UI Container
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "RNMobileUI"
ScreenGui.ResetOnSpawn = false
ScreenGui.IgnoreGuiInset = true
ScreenGui.Parent = PlayerGui

-- UI Theme
local Theme = {
    Background = Color3.fromRGB(30, 30, 40),
    Button = Color3.fromRGB(50, 50, 50),
    ButtonHover = Color3.fromRGB(70, 70, 80),
    Accent = Color3.fromRGB(255, 0, 0),
    Text = Color3.new(1, 1, 1),
    TabActive = Color3.fromRGB(155, 0, 0),
    TabInactive = Color3.fromRGB(60, 60, 80),
    TabHover = Color3.fromRGB(160, 80, 80)
}

-- Floating Toggle Button (agora movível)
local FloatButton = Instance.new("TextButton")
FloatButton.Name = "ToggleButton"
FloatButton.Size = UDim2.new(0, 60, 0, 60)
FloatButton.Position = UDim2.new(0, 20, 0.5, -30)
FloatButton.Text = "☰"
FloatButton.TextSize = 24
FloatButton.BackgroundColor3 = Theme.Accent
FloatButton.TextColor3 = Theme.Text
FloatButton.Font = Enum.Font.GothamBold
FloatButton.BorderSizePixel = 0
FloatButton.ZIndex = 10
FloatButton.Parent = ScreenGui

local buttonCorner = Instance.new("UICorner", FloatButton)
buttonCorner.CornerRadius = UDim.new(1, 0)

-- Main Panel (não movível)
local MainPanel = Instance.new("Frame")
MainPanel.Name = "MainPanel"
MainPanel.Size = UDim2.new(0, 320, 0, 450)
MainPanel.Position = UDim2.new(0, 90, 0.5, -225)
MainPanel.BackgroundColor3 = Theme.Background
MainPanel.Visible = false
MainPanel.Parent = ScreenGui

local panelCorner = Instance.new("UICorner", MainPanel)
panelCorner.CornerRadius = UDim.new(0, 12)

local panelShadow = Instance.new("ImageLabel", MainPanel)
panelShadow.Name = "Shadow"
panelShadow.Image = "rbxassetid://1316045217"
panelShadow.ImageColor3 = Color3.new(0, 0, 0)
panelShadow.ImageTransparency = 0.8
panelShadow.ScaleType = Enum.ScaleType.Slice
panelShadow.SliceCenter = Rect.new(10, 10, 118, 118)
panelShadow.Size = UDim2.new(1, 10, 1, 10)
panelShadow.Position = UDim2.new(0, -5, 0, -5)
panelShadow.BackgroundTransparency = 1
panelShadow.ZIndex = -1

-- Tab System
local TabButtonsContainer = Instance.new("Frame")
TabButtonsContainer.Name = "TabButtonsContainer"
TabButtonsContainer.Size = UDim2.new(1, 0, 0, 60)
TabButtonsContainer.Position = UDim2.new(0, 0, 0, 0)
TabButtonsContainer.BackgroundTransparency = 1
TabButtonsContainer.ClipsDescendants = true
TabButtonsContainer.Parent = MainPanel

local TabScroller = Instance.new("ScrollingFrame")
TabScroller.Name = "TabScroller"
TabScroller.Size = UDim2.new(1, 0, 1, 0)
TabScroller.BackgroundTransparency = 1
TabScroller.ScrollBarThickness = 0
TabScroller.ScrollingDirection = Enum.ScrollingDirection.X
TabScroller.VerticalScrollBarPosition = Enum.VerticalScrollBarPosition.Left
TabScroller.Parent = TabButtonsContainer

local TabButtonsLayout = Instance.new("UIListLayout", TabScroller)
TabButtonsLayout.FillDirection = Enum.FillDirection.Horizontal
TabButtonsLayout.Padding = UDim.new(0, 10)
TabButtonsLayout.VerticalAlignment = Enum.VerticalAlignment.Center

local TabContainer = Instance.new("Frame")
TabContainer.Name = "TabContainer"
TabContainer.Size = UDim2.new(1, -20, 1, -80)
TabContainer.Position = UDim2.new(0, 10, 0, 80)
TabContainer.BackgroundTransparency = 1
TabContainer.Parent = MainPanel

local Tabs = {}
local CurrentTab = nil

-- Function to create a tab
local function CreateTab(tabName)
    local TabButton = Instance.new("TextButton")
    TabButton.Name = tabName.."Tab"
    TabButton.Size = UDim2.new(0, 140, 0.65, 0)
    TabButton.Text = tabName
    TabButton.TextSize = 18
    TabButton.BackgroundColor3 = Theme.TabInactive
    TabButton.TextColor3 = Theme.Text
    TabButton.Font = Enum.Font.GothamBold
    TabButton.AutoButtonColor = false
    TabButton.Parent = TabScroller
    
    local tabCorner = Instance.new("UICorner", TabButton)
    tabCorner.CornerRadius = UDim.new(0, 10)
    
    TabButton.MouseEnter:Connect(function()
        if CurrentTab ~= tabName then
            game:GetService("TweenService"):Create(
                TabButton,
                TweenInfo.new(0.2),
                {BackgroundColor3 = Theme.TabHover}
            ):Play()
        end
    end)
    
    TabButton.MouseLeave:Connect(function()
        if CurrentTab ~= tabName then
            game:GetService("TweenService"):Create(
                TabButton,
                TweenInfo.new(0.2),
                {BackgroundColor3 = Theme.TabInactive}
            ):Play()
        end
    end)
    
    local TabFrame = Instance.new("ScrollingFrame")
    TabFrame.Name = tabName.."Frame"
    TabFrame.Size = UDim2.new(1, 0, 1, 0)
    TabFrame.BackgroundTransparency = 1
    TabFrame.Visible = false
    TabFrame.ScrollBarThickness = 8
    TabFrame.ScrollingDirection = Enum.ScrollingDirection.Y
    TabFrame.Parent = TabContainer
    
    local UIList = Instance.new("UIListLayout", TabFrame)
    UIList.Padding = UDim.new(0, 10)
    
    Tabs[tabName] = {
        Button = TabButton,
        Frame = TabFrame,
        UIList = UIList
    }
    
    TabButton.MouseButton1Click:Connect(function()
        for name, tab in pairs(Tabs) do
            tab.Frame.Visible = (name == tabName)
            tab.Button.BackgroundColor3 = (name == tabName) and Theme.TabActive or Theme.TabInactive
        end
        CurrentTab = tabName
    end)
    
    if not CurrentTab then
        CurrentTab = tabName
        TabButton.BackgroundColor3 = Theme.TabActive
        TabFrame.Visible = true
    end
    
    TabButtonsLayout:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
        TabScroller.CanvasSize = UDim2.new(0, TabButtonsLayout.AbsoluteContentSize.X + 20, 0, 0)
    end)
    
    return TabFrame
end

-- Function to create a button in a tab
local function CreateButton(tabName, buttonText, callback)
    if not Tabs[tabName] then
        warn("Tab '"..tabName.."' doesn't exist!")
        return
    end
    
    local btn = Instance.new("TextButton")
    btn.Name = buttonText.."Button"
    btn.Size = UDim2.new(1, 0, 0, 45)
    btn.Text = buttonText
    btn.TextSize = 14
    btn.BackgroundColor3 = Theme.Button
    btn.TextColor3 = Theme.Text
    btn.Font = Enum.Font.Gotham
    btn.AutoButtonColor = true
    btn.Parent = Tabs[tabName].Frame
    
    local btnCorner = Instance.new("UICorner", btn)
    btnCorner.CornerRadius = UDim.new(0, 6)
    
    btn.MouseEnter:Connect(function()
        if not btn:GetAttribute("Toggled") then
            game:GetService("TweenService"):Create(
                btn,
                TweenInfo.new(0.2),
                {BackgroundColor3 = Theme.ButtonHover}
            ):Play()
        end
    end)
    
    btn.MouseLeave:Connect(function()
        if not btn:GetAttribute("Toggled") then
            game:GetService("TweenService"):Create(
                btn,
                TweenInfo.new(0.2),
                {BackgroundColor3 = Theme.Button}
            ):Play()
        end
    end)
    
    btn.MouseButton1Click:Connect(function()
        game:GetService("TweenService"):Create(
            btn,
            TweenInfo.new(0.1),
            {BackgroundColor3 = Theme.Accent}
        ):Play()
        
        wait(0.1)
        
        if not btn:GetAttribute("Toggled") then
            game:GetService("TweenService"):Create(
                btn,
                TweenInfo.new(0.1),
                {BackgroundColor3 = Theme.ButtonHover}
            ):Play()
        end
        
        callback()
    end)
    
    Tabs[tabName].UIList:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
        Tabs[tabName].Frame.CanvasSize = UDim2.new(0, 0, 0, Tabs[tabName].UIList.AbsoluteContentSize.Y + 10)
    end)
    
    return btn
end

-- Function to create a toggle button
local function CreateToggle(tabName, buttonText, defaultState, callback)
    local btn = CreateButton(tabName, buttonText, function()
        local newState = not btn:GetAttribute("Toggled")
        btn:SetAttribute("Toggled", newState)
        
        if newState then
            game:GetService("TweenService"):Create(
                btn,
                TweenInfo.new(0.2),
                {BackgroundColor3 = Theme.Accent}
            ):Play()
        else
            game:GetService("TweenService"):Create(
                btn,
                TweenInfo.new(0.2),
                {BackgroundColor3 = Theme.Button}
            ):Play()
        end
        
        callback(newState)
    end)
    
    btn:SetAttribute("Toggled", defaultState)
    
    if defaultState then
        btn.BackgroundColor3 = Theme.Accent
    end
    
    return btn
end

-- Function to create a premium toggle switch
local function CreatePremiumToggle(tabName, buttonText, defaultState, callback)
    if not Tabs[tabName] then return end
    
    local toggleFrame = Instance.new("Frame")
    toggleFrame.Name = buttonText.."Toggle"
    toggleFrame.Size = UDim2.new(1, 0, 0, 50)
    toggleFrame.BackgroundTransparency = 1
    toggleFrame.Parent = Tabs[tabName].Frame
    
    local label = Instance.new("TextLabel")
    label.Name = "Label"
    label.Size = UDim2.new(0.6, 0, 1, 0)
    label.Position = UDim2.new(0, 50, 0, 0)
    label.Text = "  "..buttonText
    label.TextSize = 16
    label.TextXAlignment = Enum.TextXAlignment.Left
    label.BackgroundTransparency = 1
    label.TextColor3 = Theme.Text
    label.Font = Enum.Font.GothamBold
    label.Parent = toggleFrame
    
    local toggleBase = Instance.new("Frame")
    toggleBase.Name = "ToggleBase"
    toggleBase.Size = UDim2.new(0.2, 0, 0, 30)
    toggleBase.Position = UDim2.new(0.65, 0, 0.5, -15)
    toggleBase.BackgroundColor3 = Theme.TabInactive
    toggleBase.Parent = toggleFrame
    
    local corner = Instance.new("UICorner", toggleBase)
    corner.CornerRadius = UDim.new(1, 0)
    
    local toggleButton = Instance.new("Frame")
    toggleButton.Name = "ToggleButton"
    toggleButton.Size = UDim2.new(0, 24, 0, 24)
    toggleButton.Position = defaultState and UDim2.new(1, -28, 0.5, -13) or UDim2.new(0, 2, 0.5, -13)
    toggleButton.BackgroundColor3 = defaultState and Theme.Accent or Color3.fromRGB(150, 150, 150)
    toggleButton.Parent = toggleBase
    
    local buttonCorner = Instance.new("UICorner", toggleButton)
    buttonCorner.CornerRadius = UDim.new(1, 0)
    
    local currentState = defaultState
    
    local function updateToggle(state)
        currentState = state
        local tweenInfo = TweenInfo.new(0.2, Enum.EasingStyle.Quad)
        
        TweenService:Create(
            toggleButton,
            tweenInfo,
            {
                Position = state and UDim2.new(1, -28, 0.5, -13) or UDim2.new(0, 2, 0.5, -13),
                BackgroundColor3 = state and Theme.Accent or Color3.fromRGB(150, 150, 150)
            }
        ):Play()
        
        TweenService:Create(
            toggleBase,
            tweenInfo,
            {BackgroundColor3 = state and Color3.fromRGB(40, 80, 120) or Theme.TabInactive}
        ):Play()
        
        callback(state)
    end
    
    toggleBase.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseButton1 then
            updateToggle(not currentState)
        end
    end)
    
    return {
        SetState = function(newState)
            if currentState ~= newState then
                updateToggle(newState)
            end
        end,
        GetState = function()
            return currentState
        end
    }
end

-- Toggle UI visibility
local minimized = false
FloatButton.MouseButton1Click:Connect(function()
    minimized = not minimized
    MainPanel.Visible = not minimized
    
    if minimized then
        FloatButton.Text = "☰"
        game:GetService("TweenService"):Create(
            FloatButton,
            TweenInfo.new(0.3),
            {Rotation = 0}
        ):Play()
    else
        FloatButton.Text = "✕"
        game:GetService("TweenService"):Create(
            FloatButton,
            TweenInfo.new(0.3),
            {Rotation = 180}
        ):Play()
    end
end)

-- Make FLOAT BUTTON draggable (novo código)
local floatDragging = false
local floatDragStart = Vector2.new(0, 0)
local floatStartPos = Vector2.new(0, 0)

FloatButton.InputBegan:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseButton1 then
        floatDragging = true
        floatDragStart = Vector2.new(input.Position.X, input.Position.Y)
        floatStartPos = Vector2.new(FloatButton.Position.X.Offset, FloatButton.Position.Y.Offset)
    end
end)

FloatButton.InputEnded:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseButton1 then
        floatDragging = false
    end
end)

UserInputService.InputChanged:Connect(function(input)
    if floatDragging and (input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseMovement) then
        local delta = Vector2.new(input.Position.X, input.Position.Y) - floatDragStart
        FloatButton.Position = UDim2.new(0, floatStartPos.X + delta.X, 0, floatStartPos.Y + delta.Y)
    end
end)

-- Create tabs
CreateTab("Main")
CreateTab("Fram")
CreateTab("Misc")

-- Main Tab
CreateButton("Main", "Fullbright", function()
    Lighting.GlobalShadows = false
    Lighting.Brightness = 2
    Lighting.ClockTime = 14
end)

CreateButton("Main", "Close UI", function()
    ScreenGui:Destroy()
end)

-- Farm Tab
CreateButton("Fram", "aim kill", function()
local MAX_ATTACK_DISTANCE = 400

local function isPlayerAlive()
    local player = game.Players.LocalPlayer
    return player.Character and player.Character:FindFirstChild("Humanoid") and player.Character.Humanoid.Health > 0
end

local function getAllTitans()
    local titansContainer = workspace:FindFirstChild("Titans")
    if not titansContainer then
        warn("Container 'Titans' não encontrado no Workspace.")
        return {}
    end

    local titans = {}
    for _, titan in ipairs(titansContainer:GetChildren()) do
        local humanoid = titan:FindFirstChild("Humanoid")
        if titan:IsA("Model") and humanoid and humanoid.Health > 0 then
            table.insert(titans, titan)
        end
    end
    return titans
end

local function attackTitan(titan)
    local player = game.Players.LocalPlayer
    local character = player.Character
    if not character then return end

    local playerHumanoidRootPart = character:FindFirstChild("HumanoidRootPart")
    if not playerHumanoidRootPart then return end

    local titanHumanoidRootPart = titan:FindFirstChild("HumanoidRootPart")
    if not titanHumanoidRootPart then
        warn("HumanoidRootPart não encontrada no Titã: " .. titan.Name)
        return
    end

    local distance = (playerHumanoidRootPart.Position - titanHumanoidRootPart.Position).Magnitude

    if distance > MAX_ATTACK_DISTANCE then
        return
    end

    local replicatedStorage = game:GetService("ReplicatedStorage")
    local napeHitbox = titan:FindFirstChild("Hitboxes") and titan.Hitboxes.Hit:FindFirstChild("Nape")

    if napeHitbox then
        local attackArgs = {
            [1] = "Attacks",
            [2] = "Slash",
            [3] = true
        }
        local hitboxArgs = {
            [1] = "Hitboxes",
            [2] = "Register",
            [3] = napeHitbox,
            [4] = 225483, -- RN_TEAM
            [5] = 925011  -- RN_TEAM
        }

        replicatedStorage.Assets.Remotes.POST:FireServer(unpack(attackArgs))
        replicatedStorage.Assets.Remotes.GET:InvokeServer(unpack(hitboxArgs))

        print("Atacou e registrou hitbox no Titã: " .. titan.Name .. " (Distância: " .. math.floor(distance) .. " studs)")
    else
        warn("Nape hitbox não encontrada no Titã: " .. titan.Name)
    end
end

local function attackAllTitans()
    while true do
        if not isPlayerAlive() then
            warn("Jogador morto ou personagem inválido. Reiniciando em 5 segundos...")
            wait(5)
        end

        local titans = getAllTitans()

        for _, titan in ipairs(titans) do
            attackTitan(titan)
        end

        wait(0)
    end
end

attackAllTitans()
end)

CreateButton("Fram", "teleporte titãs", function()
local teleportHeight = 160 -- Altura acima do Titan (ajuste conforme necessário)

-- Variáveis
local player = game.Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoidRootPart = character:WaitForChild("HumanoidRootPart")
local titansFolder = workspace:FindFirstChild("Titans") -- Pasta onde os Titans estão
local titans = {} -- Lista de Titans
local usedTitans = {} -- Titans já teleportados

-- Função para encontrar todos os Titans na pasta
local function findTitans()
    titans = {}
    if titansFolder then
        for _, titan in pairs(titansFolder:GetChildren()) do
            if titan:FindFirstChild("HumanoidRootPart") and titan:FindFirstChild("Humanoid") then
                table.insert(titans, titan)
            end
        end
    else
        warn("Pasta dos Titans não encontrada!")
    end
end

-- Função para teleportar para um Titan e esperar ele morrer (Humanoid ser removido)
local function teleportAndWaitForDeath(titan)
    local titanRootPart = titan.HumanoidRootPart
    local titanHumanoid = titan.Humanoid
    local targetPosition = titanRootPart.Position + Vector3.new(0, teleportHeight, 0)
    
    -- Teleporta para o Titan
    humanoidRootPart.CFrame = CFrame.new(targetPosition)
    
    -- Marca o Titan como usado
    table.insert(usedTitans, titan)
    
    -- Espera até que o Humanoid do Titan seja removido (Titan morrer)
    while titan:FindFirstChild("Humanoid") do
        wait(0)
    end
    
    -- Espera um pouco antes de verificar o próximo Titan
    wait(1)
end

-- Função para verificar se um Titan já foi usado
local function isTitanUsed(titan)
    for _, usedTitan in pairs(usedTitans) do
        if usedTitan == titan then
            return true
        end
    end
    return false
end

-- Função para manter o jogador parado no ar
local function keepPlayerFrozen()
    while true do
        humanoidRootPart.Velocity = Vector3.new(0, 0, 0) -- Zera a velocidade para evitar quedas
        humanoidRootPart.RotVelocity = Vector3.new(0, 0, 0) -- Zera a rotação
        wait(0.1)
    end
end

-- Função principal
local function main()
    -- Inicia a função para manter o jogador parado no ar
    coroutine.wrap(keepPlayerFrozen)()
    
    while true do
        findTitans() -- Atualiza a lista de Titans
        
        -- Verifica se há Titans novos
        for _, titan in pairs(titans) do
            if not isTitanUsed(titan) then
                teleportAndWaitForDeath(titan)
                break
            end
        end
        
        -- Se todos os Titans foram usados, reinicia a lista
        if #usedTitans >= #titans then
            usedTitans = {}
        end
        
        wait(0.5) -- Espera antes de verificar novamente
    end
end

-- Inicia o script
main()
end)

CreateButton("Fram", "missão titã fêmea", function()
local player = game.Players.LocalPlayer

local basePath = workspace.Unclimbable.Objective

local function teleportToTarget(targetName, altura)
    local target = basePath:FindFirstChild(targetName)
    if target then
        if target:IsA("BasePart") then
            local character = player.Character
            if character and character:FindFirstChild("HumanoidRootPart") then
                local humanoidRootPart = character.HumanoidRootPart
                humanoidRootPart.CFrame = target.CFrame + Vector3.new(0, target.Size.Y / 2 + altura, 0)
                print("Personagem teleportado para cima da parte: " .. targetName)
            end
        elseif target:IsA("Model") then
            local character = player.Character
            if character and character:FindFirstChild("HumanoidRootPart") then
                local humanoidRootPart = character.HumanoidRootPart
                local modelCenter = target:GetModelCFrame().Position
                humanoidRootPart.CFrame = CFrame.new(modelCenter) + Vector3.new(0, altura, 0)
                print("Personagem teleportado para cima do modelo: " .. targetName)
            end
        else
            warn("O alvo não é uma Part ou Model.")
        end
    else
        warn("Alvo não encontrado: " .. targetName)
    end
end

local function freezePlayer()
    local character = player.Character
    if character and character:FindFirstChild("HumanoidRootPart") then
        local humanoidRootPart = character.HumanoidRootPart
        humanoidRootPart.Anchored = true
        print("Personagem congelado.")
    else
        warn("Personagem ou HumanoidRootPart não encontrados.")
    end
end

local function unfreezePlayer()
    local character = player.Character
    if character and character:FindFirstChild("HumanoidRootPart") then
        local humanoidRootPart = character.HumanoidRootPart
        humanoidRootPart.Anchored = false
        print("Personagem descongelado.")
    else
        warn("Personagem ou HumanoidRootPart não encontrados.")
    end
end

-- Exemplo de uso
local targetName = "Guard"
local altura = 150

teleportToTarget(targetName, altura)

task.wait(1)

freezePlayer()

--RN_TEAM
end)

CreateButton("Fram", "recarregar espada", function()
local args = {
    [1] = "Attacks",
    [2] = "Reload",
    [3] = workspace.Unclimbable.Reloads.GasTanks
}

game:GetService("ReplicatedStorage").Assets.Remotes.POST:FireServer(unpack(args))
end)

CreateButton("Fram", "hitbox titãs", function()
local newSize = 70
local transparency = 0.5
local color = Color3.new(1, 0, 0)

-- RN-TEAM
local function ChangeNapeHitbox(size)
    local titansFolder = workspace:FindFirstChild("Titans")
    if titansFolder then
        -- TEAM
        for _, npc in pairs(titansFolder:GetChildren()) do
            if npc:IsA("Model") then
                -- RN-TEAM
                local hitboxes = npc:FindFirstChild("Hitboxes")
                if hitboxes then
                    local hit = hitboxes:FindFirstChild("Hit")
                    if hit then
                        local nape = hit:FindFirstChild("Nape")
                        if nape then
                            -- RN-TEAM
                            pcall(function()
                                nape.Size = Vector3.new(size, size, size)
                                nape.Transparency = transparency
                                nape.Color = color -- Cor sólida
                                nape.CanCollide = false
                            end)
                        else
                            warn("Nape não encontrado no NPC: " .. npc.Name)
                        end
                    else
                        warn("Hit não encontrado no NPC: " .. npc.Name)
                    end
                else
                    warn("Hitboxes não encontrado no NPC: " .. npc.Name)
                end
            end
        end
    else
        warn("Pasta 'Titans' não encontrada no Workspace!")
    end
end

-- RN-TEAM
while true do
    ChangeNapeHitbox(newSize)
    wait(5)
end
end)

-- Misc Tab
CreateButton("Misc", "Copy Position", function()
    local character = LocalPlayer.Character
    if not character then return end
    
    local humanoidRootPart = character:FindFirstChild("HumanoidRootPart")
    if not humanoidRootPart then return end
    
    local position = humanoidRootPart.Position
    local positionString = string.format("Vector3.new(%d, %d, %d)", position.X, position.Y, position.Z)
    
    setclipboard(positionString)
    print("Copied position to clipboard:", positionString)
end)

-- Initialize UI
MainPanel.Visible = false
FloatButton.Text = "☰"
