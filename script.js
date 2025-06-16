--[[
    WARNING: Heads up! This script has not been verified by ScriptBlox. Use at your own risk!
]]

repeat task.wait(0.25) until game:IsLoaded()
getgenv().Image = "rbxassetid://15298567397"
getgenv().ToggleUI = "E"

task.spawn(function()
    if not getgenv().LoadedMobileUI then
        getgenv().LoadedMobileUI = true
        local OpenUI = Instance.new("ScreenGui")
        local ImageButton = Instance.new("ImageButton")
        local UICorner = Instance.new("UICorner")
        
        OpenUI.Name = "OpenUI"
        OpenUI.Parent = game:GetService("CoreGui")
        OpenUI.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
        
        ImageButton.Parent = OpenUI
        ImageButton.BackgroundColor3 = Color3.fromRGB(105, 105, 105)
        ImageButton.BackgroundTransparency = 0.8
        ImageButton.Position = UDim2.new(0.9, 0, 0.1, 0)
        ImageButton.Size = UDim2.new(0, 50, 0, 50)
        ImageButton.Image = getgenv().Image
        ImageButton.Draggable = true
        ImageButton.Transparency = 1
        
        UICorner.CornerRadius = UDim.new(0, 200)
        UICorner.Parent = ImageButton
        
        ImageButton.MouseButton1Click:Connect(function()
            game:GetService("VirtualInputManager"):SendKeyEvent(true, getgenv().ToggleUI, false, game)
        end)
    end
end)

local Fluent = loadstring(game:HttpGet("https://github.com/dawid-scripts/Fluent/releases/latest/download/main.lua"))()

local Window = Fluent:CreateWindow({
    Title = "Fluent " .. Fluent.Version,
    SubTitle = "by dawid",
    TabWidth = 160,
    Size = UDim2.fromOffset(580, 460),
    Acrylic = true,
    Theme = "Dark",
    MinimizeKey = Enum.KeyCode.E
})

local Tabs = {
    _1 = Window:AddTab({ Title = "auto Fram", Icon = "" }),
    Informacoes = Window:AddTab({ Title = "INFORMAÇÕES", Icon = "info" })
}

Tabs._1:AddButton({
    Title = "auto kill",
    Description = "matar todos os titãs perto de vc",
    Callback = function()
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
        if titan:IsA("Model") and titan:FindFirstChild("Humanoid") then
            table.insert(titans, titan)
        end
    end
    return titans
end

local function attackTitan(titan)
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

        print("Atacou e registrou hitbox no Titã: " .. titan.Name)
    else
        warn("Nape hitbox não encontrada no Titã: " .. titan.Name)
    end
end

local function attackAllTitans()
    while true do
        if not isPlayerAlive() then
            warn("Jogador morto ou personagem inválido.")
            wait(1)
            break
        end

        local titans = getAllTitans()

        for _, titan in ipairs(titans) do
            coroutine.wrap(attackTitan)(titan)
        end

        wait(0.1)
    end
end

attackAllTitans()
    end
})

Tabs._1:AddButton({
    Title = "auto kill V2",
    Description = "matar todos os titãs perto de vc",
    Callback = function()
       local MAX_ATTACK_DISTANCE = 200
local function isPlayerAlive()
    local player = game.Players.LocalPlayer
    return player.Character and player.Character:FindFirstChild("Humanoid") and player.Character.Humanoid.Health > 0
end

-- Função para encontrar todos os Titans no container
local function getAllTitans()
    local titansContainer = workspace:FindFirstChild("Titans")
    if not titansContainer then
        warn("Container 'Titans' não encontrado no Workspace.")
        return {}
    end

    local titans = {}
    for _, titan in ipairs(titansContainer:GetChildren()) do
        -- Adicionado verificação de Humanoid.Health para só considerar Titãs vivos
        local humanoid = titan:FindFirstChild("Humanoid")
        if titan:IsA("Model") and humanoid and humanoid.Health > 0 then
            table.insert(titans, titan)
        end
    end
    return titans
end

-- Função para atacar um Titan específico
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

    -- Calcula a distância entre o jogador e o Titã
    local distance = (playerHumanoidRootPart.Position - titanHumanoidRootPart.Position).Magnitude

    if distance > MAX_ATTACK_DISTANCE then
        -- print("Titã " .. titan.Name .. " muito longe (" .. math.floor(distance) .. " studs). Não atacando.")
        return -- Não ataca se estiver muito longe
    end

    local replicatedStorage = game:GetService("ReplicatedStorage")
    local napeHitbox = titan:FindFirstChild("Hitboxes") and titan.Hitboxes.Hit:FindFirstChild("Nape")

    if napeHitbox then
        -- Prepara os argumentos para o ataque e o registro da hitbox
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

        -- Executa o ataque e o registro da hitbox
        replicatedStorage.Assets.Remotes.POST:FireServer(unpack(attackArgs))
        replicatedStorage.Assets.Remotes.GET:InvokeServer(unpack(hitboxArgs))

        print("Atacou e registrou hitbox no Titã: " .. titan.Name .. " (Distância: " .. math.floor(distance) .. " studs)")
    else
        warn("Nape hitbox não encontrada no Titã: " .. titan.Name)
    end
end

-- Função principal para atacar todos os Titans
local function attackAllTitans()
    while true do
        -- Verifica se o jogador está vivo
        if not isPlayerAlive() then
            warn("Jogador morto ou personagem inválido. Reiniciando em 5 segundos...")
            wait(5) -- Espera mais antes de tentar novamente ou sair
            -- Se o jogador morreu, talvez você queira parar o script ou esperar o respawn.
            -- Para este exemplo, vamos esperar e continuar o loop, assumindo que ele respawna.
            -- Se você quiser que o script pare completamente, use 'break' aqui.
            -- break
        end

        -- Obtém todos os Titans (apenas os vivos)
        local titans = getAllTitans()

        -- Itera sobre todos os Titans e os ataca
        for _, titan in ipairs(titans) do
            attackTitan(titan)
        end

        wait(0.1) -- Pequeno delay para evitar sobrecarga
    end
end

-- Inicia o script de ataque
attackAllTitans()
})
Tabs._1:AddButton({
    Title = "teleporte titã",
    Description = "um teleporte que vai em todos os titãs",
    Callback = function()
       local teleportHeight = 160

local player = game.Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoidRootPart = character:WaitForChild("HumanoidRootPart")
local titansFolder = workspace:FindFirstChild("Titans")
local titans = {}
local usedTitans = {}

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

local function teleportAndWaitForDeath(titan)
    local titanRootPart = titan.HumanoidRootPart
    local titanHumanoid = titan.Humanoid
    local targetPosition = titanRootPart.Position + Vector3.new(0, teleportHeight, 0)
    
    humanoidRootPart.CFrame = CFrame.new(targetPosition)
    
    table.insert(usedTitans, titan)
    
    while titan:FindFirstChild("Humanoid") do
        wait(0)
    end
    
    wait(1)
end

local function isTitanUsed(titan)
    for _, usedTitan in pairs(usedTitans) do
        if usedTitan == titan then
            return true
        end
    end
    return false
end

local function keepPlayerFrozen()
    while true do
        humanoidRootPart.Velocity = Vector3.new(0, 0, 0)
        humanoidRootPart.RotVelocity = Vector3.new(0, 0, 0)
        wait(0.1)
    end
end

local function main()
    coroutine.wrap(keepPlayerFrozen)()
    
    while true do
        findTitans()
        
        for _, titan in pairs(titans) do
            if not isTitanUsed(titan) then
                teleportAndWaitForDeath(titan)
                break
            end
        end
        
        if #usedTitans >= #titans then
            usedTitans = {}
        end
        
        wait(0.5)
    end
end

main()
    end
})

Tabs._1:AddButton({
    Title = "auto titã femea",
    Description = "fica em cima da titã femea",
    Callback = function()
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

local targetName = "Guard"
local altura = 150

teleportToTarget(targetName, altura)

task.wait(1)

freezePlayer()

--RN_TEAM
    end
})

Tabs.Informacoes:AddParagraph({
    Title = "INFORMAÇÕES DO SERVIDOR",
    Content = "Jogadores online: " .. #game:GetService("Players"):GetPlayers() .. "\n" ..
              "Máximo de jogadores: " .. game:GetService("Players").MaxPlayers
})

Tabs.Informacoes:AddButton({
    Title = "REINICIAR SERVIDOR",
    Description = "Reinicia o jogo e mantém o mesmo servidor.",
    Callback = function()
        local currentPlayer = game.Players.LocalPlayer
        local currentServerId = game.JobId
        
        game:Shutdown()
        
        task.wait(5)
        game:GetService("TeleportService"):TeleportToPlaceInstance(game.PlaceId, currentServerId)
    end
})

Fluent:Notify({
    Title = "Notificação",
    Content = "Este é um aviso inicial",
    SubContent = "SubContent",
    Duration = 5
})

SaveManager:SetLibrary(Fluent)
InterfaceManager:SetLibrary(Fluent)

SaveManager:IgnoreThemeSettings()
SaveManager:SetIgnoreIndexes({})

InterfaceManager:SetFolder("FluentScriptHub")
SaveManager:SetFolder("FluentScriptHub/specific-game")

InterfaceManager:BuildInterfaceSection(Tabs.Informacoes)
SaveManager:BuildConfigSection(Tabs.Informacoes)

Window:SelectTab(1)

Fluent:Notify({
    Title = "Fluent",
    Content = "O script foi carregado.",
    Duration = 8
})

SaveManager:LoadAutoloadConfig()
