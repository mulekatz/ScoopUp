// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IX2EarnRewardsPool.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ScoopUpRewards Contract
 * @dev Verwaltet die Belohnungen für die ScoopUp App basierend auf VeBetterDAO Cycles
 */
contract ScoopUpRewards is AccessControl {
    // Core contracts
    IX2EarnRewardsPool public x2EarnRewardsPoolContract;
    bytes32 public appId;

    // Cycle management
    mapping(uint256 => uint256) public rewards; // Rewards pro Cycle
    mapping(uint256 => uint256) public rewardsLeft; // Verbleibende Rewards im Cycle
    uint256 public cycleDuration; // Dauer eines Cycles in Blocks
    uint256 public lastCycleStartBlock; // Startblock des letzten Cycles
    uint256 public nextCycle; // Nächste Cycle-Nummer

    // Daily submission tracking
    mapping(uint256 => mapping(address => mapping(uint256 => uint256)))
        public dailySubmissions; // Submissions pro User pro Tag im Cycle
    mapping(uint256 => uint256) public totalSubmissions; // Gesamt-Submissions pro Cycle
    uint256 public immutable MAX_SUBMISSIONS_PER_DAY;

    // Events
    event CycleStarted(uint256 cycleStartBlock);
    event Submission(address indexed participant, uint256 amount);
    event ClaimedAllocation(uint256 indexed cycle, uint256 amount);

    /**
     * @dev Constructor
     * @param _admin Admin-Adresse
     * @param _x2EarnRewardsPoolContract X2EarnRewardsPool Contract
     * @param _cycleDuration Cycle-Dauer in Blocks
     * @param _maxSubmissionsPerDay Max 100 Submissions pro Tag !! TODO: CHANGE MAX SUBMISSIONS PER DAY FOR MAINNET
     * @param _appId VeBetterDAO App ID
     */
    constructor(
        address _admin,
        address _x2EarnRewardsPoolContract,
        uint256 _cycleDuration,
        uint256 _maxSubmissionsPerDay,
        bytes32 _appId
    ) {
        require(_admin != address(0), "ScoopUp: admin cannot be zero address");
        require(
            _x2EarnRewardsPoolContract != address(0),
            "ScoopUp: rewardsPool cannot be zero address"
        );
        require(_maxSubmissionsPerDay > 0, "ScoopUp: max submissions must be greater than 0");

        x2EarnRewardsPoolContract = IX2EarnRewardsPool(
            _x2EarnRewardsPoolContract
        );
        cycleDuration = _cycleDuration;
        MAX_SUBMISSIONS_PER_DAY = _maxSubmissionsPerDay;
        nextCycle = 1;
        appId = _appId;
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    }

    /**
     * @dev Startet einen neuen Cycle
     */
    function triggerCycle() public onlyRole(DEFAULT_ADMIN_ROLE) {
        lastCycleStartBlock = block.number;
        nextCycle++;
        emit CycleStarted(lastCycleStartBlock);
    }

    /**
     * @dev Gibt den aktuellen Tag im Cycle zurück (0-6)
     */
    function getCurrentDayInCycle() public view returns (uint256) {
        return (block.number - lastCycleStartBlock) / (cycleDuration / 7);
    }

    /**
     * @dev Registriert eine validierte Submission
     * @param participant Adresse des Teilnehmers
     * @param amount Reward-Menge für die Submission
     */
    function registerValidSubmission(
        address participant,
        uint256 amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(amount > 0, "ScoopUp: Amount must be greater than 0");

        uint256 currentDay = getCurrentDayInCycle();
        require(currentDay < 7, "ScoopUp: Invalid day in cycle");

        require(
            dailySubmissions[getCurrentCycle()][participant][currentDay] <
                MAX_SUBMISSIONS_PER_DAY,
            "ScoopUp: Max daily submissions reached"
        );

        require(
            rewardsLeft[getCurrentCycle()] >= amount,
            "ScoopUp: Not enough rewards left"
        );

        require(block.number < getNextCycleBlock(), "ScoopUp: Cycle is over");

        // Registriere Submission
        dailySubmissions[getCurrentCycle()][participant][currentDay]++;
        totalSubmissions[getCurrentCycle()]++;
        rewardsLeft[getCurrentCycle()] -= amount;

        // Verteile Reward
        x2EarnRewardsPoolContract.distributeReward(
            appId,
            amount,
            participant,
            "scoopup_submission"
        );

        emit Submission(participant, amount);
    }

    /**
     * @dev Prüft ob User das tägliche Limit erreicht hat
     */
    function isUserDailyLimitReached(
        address participant
    ) public view returns (bool) {
        return
            dailySubmissions[getCurrentCycle()][participant][
                getCurrentDayInCycle()
            ] >= MAX_SUBMISSIONS_PER_DAY;
    }

    /**
     * @dev Gibt die Anzahl der verbleibenden Submissions für heute zurück
     */
    function getRemainingDailySubmissions(
        address participant
    ) public view returns (uint256) {
        uint256 currentDay = getCurrentDayInCycle();
        uint256 used = dailySubmissions[getCurrentCycle()][participant][
            currentDay
        ];
        return MAX_SUBMISSIONS_PER_DAY - used;
    }

    /**
     * @dev Setzt die Rewards für den nächsten Cycle
     * @param amount Menge an Tokens
     */
    function setRewardsAmount(
        uint256 amount
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            amount <= x2EarnRewardsPoolContract.availableFunds(appId),
            "ScoopUp: Insufficient balance"
        );
        rewards[nextCycle] = amount;
        rewardsLeft[nextCycle] = amount;
        emit ClaimedAllocation(nextCycle, amount);
    }

    /**
     * @dev Zieht verbleibende Rewards eines Cycles zurück
     * @param cycle Cycle-Nummer
     */
    function withdrawRewards(
        uint256 cycle
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(rewards[cycle] > 0, "ScoopUp: No rewards to withdraw");
        require(cycle < getCurrentCycle(), "ScoopUp: Cycle is not over");

        uint256 amount = rewardsLeft[cycle];
        rewardsLeft[cycle] = 0;

        x2EarnRewardsPoolContract.withdraw(
            amount,
            appId,
            string.concat("Withdraw from cycle ", Strings.toString(cycle))
        );
    }

    // Getter Functions
    function getCurrentCycle() public view returns (uint256) {
        return nextCycle - 1;
    }

    function getNextCycleBlock() public view returns (uint256) {
        return lastCycleStartBlock + cycleDuration;
    }

    /**
     * @dev Setzt eine neue App ID
     * @param _appId Neue App ID
     */
    function setAppId(bytes32 _appId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        appId = _appId;
    }
}
